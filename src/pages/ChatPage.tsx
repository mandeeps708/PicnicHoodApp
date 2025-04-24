import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Container,
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface ChatGroup {
  id: string;
  name: string;
  members: string[];
  lastMessage?: string;
}

const ChatPage: React.FC = () => {
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  // Mock group data
  const mockGroup: ChatGroup = {
    id: '1',
    name: 'Community Chat',
    members: ['Sarah', 'Mike', userData?.username],
    lastMessage: 'Hello everyone!'
  };

  // Initial messages
  const initialMessages: Message[] = [
    {
      id: '1',
      text: "Hey neighbors!",
      sender: 'Sarah',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: '2',
      text: "Can someone receive my order this Monday? 🥬",
      sender: 'Sarah',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setSelectedGroup(mockGroup);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && userData) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: userData.username,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#F5F5F5', // Light gray background like iOS
    }}>
      {/* Fixed Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(10px)', // iOS-like blur effect
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 'sm', mx: 'auto' }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            mr: 2,
            width: 40,
            height: 40,
          }}>
            {selectedGroup?.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {selectedGroup?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {selectedGroup?.members.join(', ')}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Messages - Scrollable Area */}
      <Box 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          mt: '80px',
          mb: '72px',
          px: 2,
          bgcolor: '#F5F5F5', // Light gray background
        }}
      >
        <Container maxWidth="sm">
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.sender === userData?.username ? 'flex-end' : 'flex-start',
                    py: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      bgcolor: message.sender === userData?.username 
                        ? '#007AFF' // iOS blue for user's messages
                        : '#FFFFFF', // White for others' messages
                      color: message.sender === userData?.username ? 'white' : 'text.primary',
                      borderRadius: 3,
                      p: 1.5,
                      mb: 0.5,
                      boxShadow: message.sender === userData?.username 
                        ? 'none'
                        : '0 1px 2px rgba(0,0,0,0.1)', // Subtle shadow for received messages
                      position: 'relative',
                      '&::before': message.sender === userData?.username ? {
                        content: '""',
                        position: 'absolute',
                        right: -6,
                        bottom: 8,
                        width: 12,
                        height: 12,
                        bgcolor: '#007AFF',
                        transform: 'rotate(45deg)',
                        zIndex: -1,
                      } : {}, // Message bubble tail for sent messages
                    }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                      {message.text}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      mx: 1,
                      mb: 1,
                    }}
                  >
                    {message.sender} • {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Typography>
                </ListItem>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Container>
      </Box>

      {/* Message Input - Fixed at Bottom */}
      <Paper
        component="form"
        onSubmit={handleSendMessage}
        elevation={0}
        sx={{
          p: 2,
          position: 'fixed',
          bottom: 64,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              size="small"
              sx={{
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#F5F5F5',
                }
              }}
            />
            <IconButton 
              color="primary" 
              type="submit"
              disabled={!newMessage.trim()}
              sx={{
                color: '#007AFF',
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default ChatPage; 