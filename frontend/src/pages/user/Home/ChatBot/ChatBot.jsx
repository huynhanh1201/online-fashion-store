import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  Paper,
  Typography,
  IconButton,
  Fade,
  Slide,
  Zoom
} from '@mui/material'
import { Chat, Send, Close, SmartToy } from '@mui/icons-material'
import axios from 'axios'

// Lấy API key từ biến môi trường
const OPENAI_API_KEY =
  typeof process !== 'undefined' && process.env.REACT_APP_OPENAI_API_KEY
    ? process.env.REACT_APP_OPENAI_API_KEY
    : import.meta.env.VITE_OPENAI_API_KEY

const ChatBot = () => {
  const [open, setOpen] = useState(false)
  const [showIcon, setShowIcon] = useState(true) // State to control chat icon visibility
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Chào bạn! Mình là chatbot thời trang. Bạn đang tìm outfit nào hôm nay? ✨'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [bounce, setBounce] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Hiệu ứng bounce cho icon chat
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      if (!open && showIcon) {
        setBounce(true)
        setTimeout(() => setBounce(false), 600)
      }
    }, 3000)

    return () => clearInterval(bounceInterval)
  }, [open, showIcon])

  const toggleChat = () => {
    if (open) {
      setOpen(false) // Start closing the chat
    } else {
      setOpen(true)
      setShowIcon(false) // Hide icon when opening chat
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Xử lý tin nhắn mặc định
    if (input.toLowerCase().includes('xin chào')) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Chào bạn! Mình sẵn sàng giúp bạn chọn outfit. Bạn thích phong cách nào: công sở, dạo phố hay dự tiệc? 👗✨'
        }
      ])
      setIsTyping(false)
      return
    }

    if (input.toLowerCase().includes('dự tiệc')) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Tuyệt vời! Cho dự tiệc, mình gợi ý váy dạ hội, đầm ôm body hoặc suit lịch lãm. Bạn muốn xem mẫu váy hay suit? Hoặc chọn màu sắc nào? 🎉👠'
        }
      ])
      setIsTyping(false)
      return
    }

    // Gửi yêu cầu đến API OpenAI
    try {
      if (!OPENAI_API_KEY) {
        throw new Error(
          'API key OpenAI không được cấu hình. Vui lòng kiểm tra file .env trong thư mục frontend.'
        )
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Bạn là chatbot cho website thời trang, trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp. Thêm emoji phù hợp vào câu trả lời.'
            },
            { role: 'user', content: input }
          ],
          stream: false,
          temperature: 0,
          max_tokens: 150
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      )

      const botReply =
        response.data.choices?.[0]?.message?.content ||
        'Mình đang xử lý, bạn chờ chút nhé! 🤖'
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }])
    } catch (error) {
      console.error(
        'Error calling OpenAI API:',
        error.response?.data || error.message
      )
      let errorMessage = error.message
      if (error.response?.status === 401) {
        errorMessage =
          'API key OpenAI không hợp lệ. Vui lòng kiểm tra key trong .env.'
      } else if (error.response?.status === 429) {
        errorMessage =
          'Vượt quá giới hạn yêu cầu. Vui lòng thử lại sau hoặc kiểm tra quota OpenAI.'
      } else if (error.response?.status === 403) {
        errorMessage =
          'Yêu cầu bị từ chối (403). Vui lòng kiểm tra quyền API key OpenAI.'
      }
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Có lỗi xảy ra: ${errorMessage}. Vui lòng thử lại sau. 😔`
        }
      ])
    }
    setIsTyping(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const TypingIndicator = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1
      }}
    >
      <Paper
        sx={{
          p: 2,
          bgcolor: 'white',
          borderRadius: '20px 20px 20px 5px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <SmartToy sx={{ fontSize: 16, color: 'primary.main' }} />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: `${dot * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 80%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                  '40%': { opacity: 1, transform: 'scale(1)' }
                }
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {showIcon && (
        <IconButton
          color='primary'
          onClick={toggleChat}
          sx={{
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: 60,
            height: 60,
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: bounce ? 'scale(1.1)' : 'scale(1)',
            animation: bounce ? 'bounce 0.6s ease' : 'none',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)'
            },
            '@keyframes bounce': {
              '0%, 20%, 60%, 100%': { transform: 'translateY(0) scale(1)' },
              '40%': { transform: 'translateY(-10px) scale(1.05)' },
              '80%': { transform: 'translateY(-5px) scale(1.02)' }
            }
          }}
        >
          <Chat sx={{ color: 'white', fontSize: 28 }} />
        </IconButton>
      )}

      <Slide
        direction='up'
        in={open}
        mountOnEnter
        unmountOnExit
        timeout={400}
        onExit={() => setTimeout(() => setShowIcon(true), 400)} // Show icon after animation completes
      >
        <Paper
          elevation={0}
          sx={{
            width: 320,
            height: 450,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy sx={{ fontSize: 24 }} />
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                Chatbot Thời Trang
              </Typography>
            </Box>
            <IconButton
              onClick={toggleChat}
              sx={{
                color: 'white',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'rotate(90deg)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              background: 'linear-gradient(to bottom, #f8f9ff, #e8f0fe)',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '3px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(102, 126, 234, 0.3)',
                borderRadius: '3px',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.5)'
                }
              }
            }}
          >
            {messages.map((msg, index) => (
              <Fade in={true} timeout={500} key={index}>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent:
                      msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '85%',
                      borderRadius:
                        msg.sender === 'user'
                          ? '20px 20px 5px 20px'
                          : '20px 20px 20px 5px',
                      background:
                        msg.sender === 'user'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'white',
                      color: msg.sender === 'user' ? 'white' : 'text.primary',
                      boxShadow:
                        msg.sender === 'user'
                          ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                          : '0 2px 10px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        lineHeight: 1.5,
                        fontSize: '14px'
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              background: 'white',
              borderTop: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                size='small'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Nhập câu hỏi của bạn...'
                disabled={isTyping}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    bgcolor: '#f8f9ff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#f0f2ff'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '12px 16px'
                  }
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                sx={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  width: 44,
                  height: 44,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'scale(1.05)'
                  },
                  '&:disabled': {
                    background: '#ccc',
                    color: 'white',
                    opacity: 0.6
                  }
                }}
              >
                <Send sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </Box>
  )
}

export default ChatBot