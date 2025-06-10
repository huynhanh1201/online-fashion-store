import React, { useState } from 'react'
import { Box, TextField, Paper, Typography, IconButton } from '@mui/material'
import { Chat, Send, Close } from '@mui/icons-material'
import axios from 'axios'

// Lấy API key từ biến môi trường (Create React App hoặc Vite)
const XAI_API_KEY =
  process.env.REACT_APP_XAI_API_KEY || import.meta.env.VITE_XAI_API_KEY

const ChatBot = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Chào bạn! Mình là chatbot thời trang. Bạn đang tìm outfit nào hôm nay?'
    }
  ])
  const [input, setInput] = useState('')

  const toggleChat = () => {
    setOpen(!open)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')

    // Xử lý tin nhắn mặc định
    if (input.toLowerCase().includes('xin chào')) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Chào bạn! Mình sẵn sàng giúp bạn chọn outfit. Bạn thích phong cách nào: công sở, dạo phố hay dự tiệc?'
        }
      ])
      return
    }

    if (input.toLowerCase().includes('dự tiệc')) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Tuyệt vời! Cho dự tiệc, mình gợi ý váy dạ hội, đầm ôm body hoặc suit lịch lãm. Bạn muốn xem mẫu váy hay suit? Hoặc chọn màu sắc nào?'
        }
      ])
      return
    }

    // Gửi yêu cầu đến API xAI
    try {
      if (!XAI_API_KEY) {
        throw new Error(
          'API key không được cấu hình. Vui lòng kiểm tra file .env.'
        )
      }

      const response = await axios.post(
        'https://api.x.ai/v1/chat/completions',
        {
          model: 'grok-3-latest',
          messages: [
            {
              role: 'system',
              content:
                'Bạn là chatbot cho website thời trang, trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.'
            },
            { role: 'user', content: input }
          ],
          stream: false,
          temperature: 0,
          max_tokens: 150
        },
        {
          headers: {
            Authorization: `Bearer ${XAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      )

      const botReply =
        response.data.choices?.[0]?.message?.content ||
        'Mình đang xử lý, bạn chờ chút nhé!'
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }])
    } catch (error) {
      console.error(
        'Error calling xAI API:',
        error.response?.data || error.message
      )
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Có lỗi xảy ra: ${error.message}. Bạn thử lại nhé!`
        }
      ])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {!open && (
        <IconButton
          color='primary'
          onClick={toggleChat}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <Chat sx={{ color: 'white' }} />
        </IconButton>
      )}
      {open && (
        <Paper
          elevation={3}
          sx={{
            width: 300,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper'
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='h6'>Chatbot Thời Trang</Typography>
            <IconButton onClick={toggleChat} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: '#f5f5f5'
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  display: 'flex',
                  justifyContent:
                    msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    maxWidth: '70%',
                    bgcolor: msg.sender === 'user' ? 'primary.light' : 'white'
                  }}
                >
                  <Typography variant='body2'>{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              size='small'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Nhập câu hỏi...'
              sx={{ mr: 1 }}
            />
            <IconButton color='primary' onClick={sendMessage}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default ChatBot
