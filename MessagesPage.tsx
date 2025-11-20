import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';

interface MessagesPageProps {
  onPageChange: (page: string) => void;
}

const apiUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:4000';

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  lostItemId: string;
  foundItemId: string;
  lostItemTitle: string;
  foundItemTitle: string;
  matchConfidence: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onPageChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMatches();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadMatches = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/matches/user/${user!.id}`);
      const data = await res.json();
      
      if (data.matches && Array.isArray(data.matches)) {
        // Transform matches into conversations
        const convs = data.matches.map((match: any) => {
          // Determine who is the other user
          const isUserLostReporter = match.lostReportedBy === user!.id;
          const otherUserId = isUserLostReporter ? match.foundReportedBy : match.lostReportedBy;
          const otherUserName = isUserLostReporter ? match.foundReporterName : match.lostReporterName;
          
          return {
            id: match.id,
            matchId: match.id,
            otherUserId: otherUserId,
            otherUserName: otherUserName,
            lostItemId: match.lostItemId,
            foundItemId: match.foundItemId,
            lostItemTitle: match.lostTitle,
            foundItemTitle: match.foundTitle,
            matchConfidence: match.confidence,
            lastMessage: '',
            lastMessageTime: match.createdAt,
            unreadCount: 0
          };
        });
        setConversations(convs);
      }
    } catch (err) {
      console.error('Failed to load matches', err);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/messages/${user!.id}`);
      const data = await res.json();
      
      if (data.messages && Array.isArray(data.messages)) {
        // Filter messages for this conversation
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
          const filtered = data.messages.filter((msg: any) => 
            msg.lostItemId === conv.lostItemId && msg.foundItemId === conv.foundItemId
          );
          setMessages(filtered);
        }
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conv = conversations.find(c => c.id === selectedConversation);
    if (!conv) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: user!.id,
          toUserId: conv.otherUserId,
          lostItemId: conv.lostItemId,
          foundItemId: conv.foundItemId,
          content: newMessage
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        
        // Update conversation last message
        setConversations(prev => prev.map(c => 
          c.id === selectedConversation 
            ? { ...c, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
            : c
        ));
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your messages.</p>
            <button
              onClick={() => onPageChange('login')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
          <p className="text-gray-600">Communicate with other users about matched items</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                        selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.otherUserName}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            Re: {conversation.lostItemTitle} → {conversation.foundItemTitle}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {conversations.find(c => c.id === selectedConversation)?.otherUserName}
                        </p>
                        <p className="text-sm text-gray-500">
                          About: {conversations.find(c => c.id === selectedConversation)?.lostItemTitle} → {conversations.find(c => c.id === selectedConversation)?.foundItemTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.fromUserId === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.fromUserId === user?.id ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;