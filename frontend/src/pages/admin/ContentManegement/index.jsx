// import React, { useState } from 'react'
// import {
//   Card,
//   CardContent,
//   Input,
//   Button,
//   TextField,
//   Checkbox,
//   FormControlLabel
// } from '@mui/material'
// import Tabs from '@mui/material/Tabs'
// import Tab from '@mui/material/Tab'
// import Box from '@mui/material/Box'
//
// const Image = (props) => <img {...props} alt={props.alt || 'image'} />
//
// // dữ liệu mẫu
// const initialCmsData = [
//   {
//     key: 'header',
//     title: 'Cấu hình Header',
//     description: 'Quản lý logo, menu, banner và các hành động của Header.',
//     content: {
//       logo: {
//         imageUrl: '/uploads/logo.png',
//         alt: 'Logo website'
//       },
//       topBanner: [
//         {
//           visible: true,
//           text: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ'
//         },
//         {
//           visible: true,
//           text: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ'
//         }
//       ]
//     }
//   },
//   {
//     key: 'home',
//     title: 'Cấu hình Trang chủ',
//     description:
//       'Quản lý nội dung hiển thị ở trang chủ: banner, danh mục, sản phẩm nổi bật, khuyến mãi,...',
//     content: {
//       heroBanners: [
//         {
//           imageUrl: '/uploads/banner1.jpg',
//           title: 'BST Hè 2025',
//           subtitle: 'Giảm đến 50%'
//         },
//         {
//           imageUrl: '/uploads/banner2.jpg',
//           title: 'Thời trang công sở',
//           subtitle: 'Phong cách & Lịch lãm'
//         }
//       ],
//       serviceHighlights: [
//         {
//           imageUrl: '/uploads/icons/free-delivery.png',
//           title: 'Miễn phí vận chuyển',
//           subtitle: 'Đơn hàng trên 500K'
//         },
//         {
//           imageUrl: '/uploads/icons/cod.png',
//           title: 'Ship COD toàn quốc',
//           subtitle: 'Yên tâm mua sắm'
//         },
//         {
//           imageUrl: '/uploads/icons/return.png',
//           title: 'Đổi trả dễ dàng',
//           subtitle: '7 ngày đổi trả'
//         },
//         {
//           imageUrl: '/uploads/icons/support.png',
//           title: 'Hotline: 0123456789',
//           subtitle: 'Hỗ trợ bạn 24/24'
//         }
//       ],
//       featuredCategories: [
//         {
//           name: 'Áodđi làm',
//           imageUrl: '/uploads/ao-di-lam.jpg'
//         },
//         {
//           name: 'Đồ mặc hằng ngày',
//           imageUrl: '/uploads/do-mac-hang-ngay.jpg'
//         }
//       ],
//       flashSale: {
//         enabled: true,
//         title: 'Flash Sale 7 thang 7',
//         endTime: '2025-07-30T23:59:59+07:00',
//         productIds: [123, 124, 125]
//       },
//       promotionalBanners: [
//         {
//           imageUrl: '/uploads/banner-voucher-1.jpg',
//           alt: 'Voucher tháng 6'
//         }
//       ],
//       collectionBanners: [
//         {
//           imageUrl: '/uploads/banner-cl-1.jpg',
//           alt: 'Kết hợp với Yuamikami'
//         },
//         {
//           imageUrl: '/uploads/banner-cl-2.jpg',
//           alt: 'Collapse với Ozawa'
//         }
//       ],
//       seo: {
//         metaTitle: 'Trang chủ - Thời trang 2025',
//         metaDescription:
//           'Khám phá thời trang mới nhất tại cửa hàng của chúng tôi.'
//       }
//     }
//   },
//   {
//     key: 'footer',
//     title: 'Cấu hình Footer',
//     description: 'Quản lý nội dung hiển thị dưới chân trang',
//     content: {
//       logo: {
//         imageUrl: '/uploads/logo-footer.png',
//         alt: 'Logo chân trang',
//         link: '/'
//       },
//       about: [
//         {
//           text: 'Cửa hàng thời trang hiện đại, uy tín, phục vụ bạn từ năm 2020.',
//           address: '123 Đường ABC, Quận 1, TP.HCM',
//           phone: '0123 456 789',
//           email: 'support@example.com'
//         },
//         {
//           text: 'Cửa hàng thời trang hiện đại, uy tín, phục vụ bạn từ năm 2020.',
//           address: '123 Đường ABC, Quận 1, TP.HCM',
//           phone: '0123 456 789',
//           email: 'support@example.com'
//         }
//       ],
//       menuColumns: [
//         {
//           title: 'chính sách',
//           subtitle: 'Chính sách của FashionStore',
//           text: 'abcxyz'
//         },
//         {
//           title: 'Hỗ trợ',
//           items: [
//             { label: 'Hướng dẫn mua hàng', link: '/help' },
//             { label: 'Chính sách đổi trả', link: '/policy/return' }
//           ]
//         }
//       ],
//       socialLinks: [
//         {
//           image: 'facebook',
//           link: 'https://facebook.com/example'
//         },
//         {
//           image: 'instagram',
//           link: 'https://instagram.com/example'
//         }
//       ],
//       copyright: '© 2025 Công ty TNHH Thời Trang ABC. Đã đăng ký bản quyền.'
//     }
//   }
// ]
//
// export default function ContentManegement() {
//   const [activeTab, setActiveTab] = useState('header')
//   const [data, setData] = useState(initialCmsData)
//
//   const updateContent = (sectionKey, updater) => {
//     setData((prevData) =>
//       prevData.map((section) => {
//         if (section.key === sectionKey) {
//           return {
//             ...section,
//             content: updater(section.content)
//           }
//         }
//         return section
//       })
//     )
//   }
//
//   const handleFieldChange = (sectionKey, path, value) => {
//     updateContent(sectionKey, (content) => {
//       const newContent = { ...content }
//       let current = newContent
//       for (let i = 0; i < path.length - 1; i++) {
//         current = current[path[i]]
//       }
//       current[path[path.length - 1]] = value
//       return newContent
//     })
//   }
//
//   const handleArrayFieldChange = (sectionKey, arrayKey, idx, field, value) => {
//     updateContent(sectionKey, (content) => {
//       const updated = [...(content[arrayKey] || [])]
//       updated[idx] = { ...updated[idx], [field]: value }
//       return { ...content, [arrayKey]: updated }
//     })
//   }
//
//   const handleNestedArrayFieldChange = (
//     sectionKey,
//     arrayKey,
//     idx,
//     nestedField,
//     nestedIdx,
//     field,
//     value
//   ) => {
//     updateContent(sectionKey, (content) => {
//       const outer = [...(content[arrayKey] || [])]
//       const inner = [...(outer[idx][nestedField] || [])]
//       inner[nestedIdx][field] = value
//       outer[idx][nestedField] = inner
//       return { ...content, [arrayKey]: outer }
//     })
//   }
//
//   const handleSave = (sectionKey) => {
//     const section = data.find((s) => s.key === sectionKey)
//     console.log('Đã lưu cấu hình:', section)
//     alert('Đã lưu nội dung cho mục: ' + section.title)
//   }
//
//   return (
//     <div className='p-6'>
//       <h1 className='text-2xl font-bold mb-4'>Trang quản lý nội dung</h1>
//
//       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//         <Tabs
//           value={activeTab}
//           onChange={(e, newValue) => setActiveTab(newValue)}
//           aria-label='CMS Tabs'
//         >
//           {data.map((section) => (
//             <Tab key={section.key} label={section.title} value={section.key} />
//           ))}
//         </Tabs>
//       </Box>
//
//       {data.map(
//         (section) =>
//           activeTab === section.key && (
//             <Box key={section.key} sx={{ mt: 2 }}>
//               <Card variant='outlined'>
//                 <CardContent>
//                   <p style={{ color: '#666' }}>{section.description}</p>
//
//                   {section.content.logo && (
//                     <>
//                       <TextField
//                         label='Logo URL'
//                         value={section.content.logo.imageUrl || ''}
//                         onChange={(e) =>
//                           handleFieldChange(
//                             section.key,
//                             ['logo', 'imageUrl'],
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                       <TextField
//                         label='Logo Alt'
//                         value={section.content.logo.alt || ''}
//                         onChange={(e) =>
//                           handleFieldChange(
//                             section.key,
//                             ['logo', 'alt'],
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                     </>
//                   )}
//
//                   {section.content.topBanner?.map((banner, idx) => (
//                     <Box key={idx} sx={{ mt: 2 }}>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={banner.visible}
//                             onChange={(e) =>
//                               handleArrayFieldChange(
//                                 section.key,
//                                 'topBanner',
//                                 idx,
//                                 'visible',
//                                 e.target.checked
//                               )
//                             }
//                           />
//                         }
//                         label={`Hiện Top Banner ${idx + 1}`}
//                       />
//                       <TextField
//                         label={`Top Banner ${idx + 1} - Text`}
//                         value={banner.text}
//                         onChange={(e) =>
//                           handleArrayFieldChange(
//                             section.key,
//                             'topBanner',
//                             idx,
//                             'text',
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                     </Box>
//                   ))}
//
//                   {section.content.heroBanners?.map((banner, idx) => (
//                     <Box
//                       key={idx}
//                       sx={{ mt: 2, border: '1px solid #eee', p: 2 }}
//                     >
//                       <TextField
//                         label={`Hero Banner ${idx + 1} - Title`}
//                         value={banner.title}
//                         onChange={(e) =>
//                           handleArrayFieldChange(
//                             section.key,
//                             'heroBanners',
//                             idx,
//                             'title',
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                       <TextField
//                         label={`Hero Banner ${idx + 1} - Subtitle`}
//                         value={banner.subtitle}
//                         onChange={(e) =>
//                           handleArrayFieldChange(
//                             section.key,
//                             'heroBanners',
//                             idx,
//                             'subtitle',
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                     </Box>
//                   ))}
//
//                   {section.content.seo && (
//                     <Box sx={{ mt: 2 }}>
//                       <TextField
//                         label='Meta Title'
//                         value={section.content.seo.metaTitle || ''}
//                         onChange={(e) =>
//                           handleFieldChange(
//                             section.key,
//                             ['seo', 'metaTitle'],
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                       <TextField
//                         label='Meta Description'
//                         value={section.content.seo.metaDescription || ''}
//                         onChange={(e) =>
//                           handleFieldChange(
//                             section.key,
//                             ['seo', 'metaDescription'],
//                             e.target.value
//                           )
//                         }
//                         fullWidth
//                         margin='dense'
//                       />
//                     </Box>
//                   )}
//
//                   <Button
//                     variant='contained'
//                     color='primary'
//                     sx={{ mt: 2 }}
//                     onClick={() => handleSave(section.key)}
//                   >
//                     Lưu nội dung
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Box>
//           )
//       )}
//     </div>
//   )
// }

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Input,
  Button,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Checkbox,
  Typography
} from '@mui/material'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const Image = (props) => <img {...props} alt={props.alt || 'image'} />

const initialCmsData = [
  {
    key: 'header',
    title: 'Cấu hình Header',
    description: 'Quản lý logo, menu, banner và các hành động của Header.',
    content: {
      logo: {
        imageUrl: '/uploads/logo.png',
        alt: 'Logo website'
      },
      topBanner: [
        {
          visible: true,
          text: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ'
        },
        {
          visible: true,
          text: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ'
        }
      ]
    }
  },
  {
    key: 'home',
    title: 'Cấu hình Trang chủ',
    description:
      'Quản lý nội dung hiển thị ở trang chủ: banner, danh mục, sản phẩm nổi bật, khuyến mãi,...',
    content: {
      heroBanners: [
        {
          imageUrl: '/uploads/banner1.jpg',
          title: 'BST Hè 2025',
          subtitle: 'Giảm đến 50%'
        },
        {
          imageUrl: '/uploads/banner2.jpg',
          title: 'Thời trang công sở',
          subtitle: 'Phong cách & Lịch lãm'
        }
      ],
      serviceHighlights: [
        {
          imageUrl: '/uploads/icons/free-delivery.png',
          title: 'Miễn phí vận chuyển',
          subtitle: 'Đơn hàng trên 500K'
        },
        {
          imageUrl: '/uploads/icons/cod.png',
          title: 'Ship COD toàn quốc',
          subtitle: 'Yên tâm mua sắm'
        },
        {
          imageUrl: '/uploads/icons/return.png',
          title: 'Đổi trả dễ dàng',
          subtitle: '7 ngày đổi trả'
        },
        {
          imageUrl: '/uploads/icons/support.png',
          title: 'Hotline: 0123456789',
          subtitle: 'Hỗ trợ bạn 24/24'
        }
      ],
      featuredCategories: [
        {
          name: 'Áodđi làm',
          imageUrl: '/uploads/ao-di-lam.jpg'
        },
        {
          name: 'Đồ mặc hằng ngày',
          imageUrl: '/uploads/do-mac-hang-ngay.jpg'
        }
      ],
      flashSale: {
        enabled: true,
        title: 'Flash Sale 7 thang 7',
        endTime: '2025-07-30T23:59:59+07:00',
        productIds: [123, 124, 125]
      },
      promotionalBanners: [
        {
          imageUrl: '/uploads/banner-voucher-1.jpg',
          alt: 'Voucher tháng 6'
        }
      ],
      collectionBanners: [
        {
          imageUrl: '/uploads/banner-cl-1.jpg',
          alt: 'Kết hợp với Yuamikami'
        },
        {
          imageUrl: '/uploads/banner-cl-2.jpg',
          alt: 'Collapse với Ozawa'
        }
      ],
      seo: {
        metaTitle: 'Trang chủ - Thời trang 2025',
        metaDescription:
          'Khám phá thời trang mới nhất tại cửa hàng của chúng tôi.'
      }
    }
  },
  {
    key: 'footer',
    title: 'Cấu hình Footer',
    description: 'Quản lý nội dung hiển thị dưới chân trang',
    content: {
      logo: {
        imageUrl: '/uploads/logo-footer.png',
        alt: 'Logo chân trang',
        link: '/'
      },
      about: [
        {
          text: 'Cửa hàng thời trang hiện đại, uy tín, phục vụ bạn từ năm 2020.',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          phone: '0123 456 789',
          email: 'support@example.com'
        },
        {
          text: 'Cửa hàng thời trang hiện đại, uy tín, phục vụ bạn từ năm 2020.',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          phone: '0123 456 789',
          email: 'support@example.com'
        }
      ],
      menuColumns: [
        {
          title: 'chính sách',
          subtitle: 'Chính sách của FashionStore',
          text: 'abcxyz'
        },
        {
          title: 'Hỗ trợ',
          items: [
            { label: 'Hướng dẫn mua hàng', link: '/help' },
            { label: 'Chính sách đổi trả', link: '/policy/return' }
          ]
        }
      ],
      socialLinks: [
        {
          image: 'facebook',
          link: 'https://facebook.com/example'
        },
        {
          image: 'instagram',
          link: 'https://instagram.com/example'
        }
      ],
      copyright: '© 2025 Công ty TNHH Thời Trang ABC. Đã đăng ký bản quyền.'
    }
  }
]

export default function ContentManegement() {
  const [activeTab, setActiveTab] = useState('header')
  const [data, setData] = useState(initialCmsData)

  const handleFieldChange = (sectionKey, path, value) => {
    setData((prevData) =>
      prevData.map((section) => {
        if (section.key === sectionKey) {
          const updatedSection = { ...section }
          let target = updatedSection.content
          for (let i = 0; i < path.length - 1; i++) {
            target = target[path[i]]
          }
          target[path[path.length - 1]] = value
          return updatedSection
        }
        return section
      })
    )
  }

  const handleLogoRemove = (sectionKey) => {
    handleFieldChange(sectionKey, ['logo', 'imageUrl'], '')
  }

  const handleSave = (sectionKey) => {
    const section = data.find((s) => s.key === sectionKey)
    console.log('Đã lưu cấu hình:', section)
    alert('Đã lưu nội dung cho mục: ' + section.title)
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Trang quản lý nội dung</h1>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label='CMS Tabs'
        >
          {data.map((section) => (
            <Tab key={section.key} label={section.title} value={section.key} />
          ))}
        </Tabs>
      </Box>

      {data.map(
        (section) =>
          activeTab === section.key && (
            <Box key={section.key} sx={{ mt: 2 }}>
              <Card variant='outlined'>
                <CardContent>
                  <p style={{ color: '#666' }}>{section.description}</p>

                  {section.key === 'header' && section.content?.logo && (
                    <div style={{ marginTop: 16 }}>
                      <p>
                        <strong>Logo:</strong>
                      </p>
                      {section.content.logo.imageUrl ? (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <img
                            src={section.content.logo.imageUrl}
                            alt={section.content.logo.alt || ''}
                            style={{ maxHeight: 40 }}
                          />
                          <IconButton
                            onClick={() =>
                              handleFieldChange(
                                section.key,
                                ['logo', 'imageUrl'],
                                ''
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton component='label'>
                            <EditIcon />
                            <input
                              type='file'
                              hidden
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  const url = URL.createObjectURL(file)
                                  handleFieldChange(
                                    section.key,
                                    ['logo', 'imageUrl'],
                                    url
                                  )
                                }
                              }}
                            />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          variant='outlined'
                          component='label'
                          sx={{ mt: 1 }}
                        >
                          Chọn logo
                          <input
                            type='file'
                            hidden
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const url = URL.createObjectURL(file)
                                handleFieldChange(
                                  section.key,
                                  ['logo', 'imageUrl'],
                                  url
                                )
                              }
                            }}
                          />
                        </Button>
                      )}
                      <TextField
                        label='Logo Alt'
                        value={section.content.logo.alt || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            section.key,
                            ['logo', 'alt'],
                            e.target.value
                          )
                        }
                        fullWidth
                        margin='dense'
                      />
                    </div>
                  )}

                  {section.content?.seo && (
                    <div style={{ marginTop: 16 }}>
                      <Typography variant='h6'>Thông tin SEO</Typography>
                      <TextField
                        label='Meta Title'
                        value={section.content.seo.metaTitle || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            section.key,
                            ['seo', 'metaTitle'],
                            e.target.value
                          )
                        }
                        fullWidth
                        margin='dense'
                      />
                      <TextField
                        label='Meta Description'
                        value={section.content.seo.metaDescription || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            section.key,
                            ['seo', 'metaDescription'],
                            e.target.value
                          )
                        }
                        fullWidth
                        multiline
                        rows={3}
                        margin='dense'
                      />
                      <Button
                        variant='outlined'
                        component='label'
                        sx={{ mt: 1 }}
                      >
                        Chọn ảnh SEO
                        <input
                          type='file'
                          accept='image/*'
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              const url = URL.createObjectURL(file)
                              handleFieldChange(
                                section.key,
                                ['seo', 'image'],
                                url
                              )
                            }
                          }}
                        />
                      </Button>
                      {section.content.seo.image && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={section.content.seo.image}
                            alt='SEO'
                            style={{ maxHeight: 80 }}
                          />
                        </Box>
                      )}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={section.content.seo.visible || false}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['seo', 'visible'],
                                e.target.checked
                              )
                            }
                          />
                        }
                        label='Hiển thị SEO'
                        sx={{ mt: 1 }}
                      />
                    </div>
                  )}

                  {section.content?.serviceHighlights && (
                    <div style={{ marginTop: 32 }}>
                      <Typography variant='h6'>Dịch vụ nổi bật</Typography>
                      {section.content.serviceHighlights.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <TextField
                            label='Tiêu đề'
                            value={item.title || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['serviceHighlights', index, 'title'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <TextField
                            label='Mô tả'
                            value={item.subtitle || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['serviceHighlights', index, 'subtitle'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <Button
                            variant='outlined'
                            component='label'
                            sx={{ mt: 1 }}
                          >
                            Chọn ảnh
                            <input
                              type='file'
                              hidden
                              accept='image/*'
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  const url = URL.createObjectURL(file)
                                  handleFieldChange(
                                    section.key,
                                    ['serviceHighlights', index, 'imageUrl'],
                                    url
                                  )
                                }
                              }}
                            />
                          </Button>
                          {item.imageUrl && (
                            <Box sx={{ mt: 1 }}>
                              <img
                                src={item.imageUrl}
                                alt='Dịch vụ'
                                style={{ maxHeight: 60 }}
                              />
                            </Box>
                          )}
                        </Box>
                      ))}
                    </div>
                  )}

                  {section.content?.featuredCategories && (
                    <div style={{ marginTop: 32 }}>
                      <Typography variant='h6'>Danh mục nổi bật</Typography>
                      {section.content.featuredCategories.map((cat, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <TextField
                            label='Tên danh mục'
                            value={cat.name || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['featuredCategories', index, 'name'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <Button
                            variant='outlined'
                            component='label'
                            sx={{ mt: 1 }}
                          >
                            Chọn ảnh
                            <input
                              type='file'
                              hidden
                              accept='image/*'
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  const url = URL.createObjectURL(file)
                                  handleFieldChange(
                                    section.key,
                                    ['featuredCategories', index, 'imageUrl'],
                                    url
                                  )
                                }
                              }}
                            />
                          </Button>
                          {cat.imageUrl && (
                            <Box sx={{ mt: 1 }}>
                              <img
                                src={cat.imageUrl}
                                alt='Danh mục'
                                style={{ maxHeight: 60 }}
                              />
                            </Box>
                          )}
                        </Box>
                      ))}
                    </div>
                  )}

                  {section.content?.promotionalBanners && (
                    <div style={{ marginTop: 32 }}>
                      <Typography variant='h6'>Banner khuyến mãi</Typography>
                      {section.content.promotionalBanners.map(
                        (banner, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                              label='Mô tả ảnh (alt)'
                              value={banner.alt || ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  section.key,
                                  ['promotionalBanners', index, 'alt'],
                                  e.target.value
                                )
                              }
                              fullWidth
                              margin='dense'
                            />
                            <Button
                              variant='outlined'
                              component='label'
                              sx={{ mt: 1 }}
                            >
                              Chọn ảnh
                              <input
                                type='file'
                                hidden
                                accept='image/*'
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file) {
                                    const url = URL.createObjectURL(file)
                                    handleFieldChange(
                                      section.key,
                                      ['promotionalBanners', index, 'imageUrl'],
                                      url
                                    )
                                  }
                                }}
                              />
                            </Button>
                            {banner.imageUrl && (
                              <Box sx={{ mt: 1 }}>
                                <img
                                  src={banner.imageUrl}
                                  alt='Khuyến mãi'
                                  style={{ maxHeight: 80 }}
                                />
                              </Box>
                            )}
                          </Box>
                        )
                      )}
                    </div>
                  )}

                  {section.content?.collectionBanners && (
                    <div style={{ marginTop: 32 }}>
                      <Typography variant='h6'>Banner bộ sưu tập</Typography>
                      {section.content.collectionBanners.map(
                        (banner, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                              label='Mô tả ảnh (alt)'
                              value={banner.alt || ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  section.key,
                                  ['collectionBanners', index, 'alt'],
                                  e.target.value
                                )
                              }
                              fullWidth
                              margin='dense'
                            />
                            <Button
                              variant='outlined'
                              component='label'
                              sx={{ mt: 1 }}
                            >
                              Chọn ảnh
                              <input
                                type='file'
                                hidden
                                accept='image/*'
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file) {
                                    const url = URL.createObjectURL(file)
                                    handleFieldChange(
                                      section.key,
                                      ['collectionBanners', index, 'imageUrl'],
                                      url
                                    )
                                  }
                                }}
                              />
                            </Button>
                            {banner.imageUrl && (
                              <Box sx={{ mt: 1 }}>
                                <img
                                  src={banner.imageUrl}
                                  alt='Bộ sưu tập'
                                  style={{ maxHeight: 80 }}
                                />
                              </Box>
                            )}
                          </Box>
                        )
                      )}
                    </div>
                  )}

                  {section.content?.topBanner?.map((banner, idx) => (
                    <TextField
                      key={idx}
                      label={`Top Banner ${idx + 1}`}
                      value={banner.text}
                      onChange={(e) =>
                        handleFieldChange(
                          section.key,
                          ['topBanner', idx, 'text'],
                          e.target.value
                        )
                      }
                      fullWidth
                      margin='dense'
                    />
                  ))}

                  {section.key === 'footer' && section.content?.logo && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant='h6'>Logo chân trang</Typography>
                      <TextField
                        label='Link khi click'
                        value={section.content.logo.link || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            section.key,
                            ['logo', 'link'],
                            e.target.value
                          )
                        }
                        fullWidth
                        margin='dense'
                      />
                      <TextField
                        label='Alt text'
                        value={section.content.logo.alt || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            section.key,
                            ['logo', 'alt'],
                            e.target.value
                          )
                        }
                        fullWidth
                        margin='dense'
                      />
                      <Button
                        variant='outlined'
                        component='label'
                        sx={{ mt: 1 }}
                      >
                        Chọn ảnh logo
                        <input
                          type='file'
                          hidden
                          accept='image/*'
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              const url = URL.createObjectURL(file)
                              handleFieldChange(
                                section.key,
                                ['logo', 'imageUrl'],
                                url
                              )
                            }
                          }}
                        />
                      </Button>
                      {section.content.logo.imageUrl && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={section.content.logo.imageUrl}
                            alt='Logo footer'
                            style={{ maxHeight: 80 }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}

                  {section.content?.about?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant='h6'>Thông tin Giới thiệu</Typography>
                      {section.content.about.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{ mt: 2, border: '1px solid #eee', p: 2 }}
                        >
                          <TextField
                            label='Giới thiệu'
                            value={item.text || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['about', idx, 'text'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <TextField
                            label='Địa chỉ'
                            value={item.address || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['about', idx, 'address'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <TextField
                            label='Số điện thoại'
                            value={item.phone || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['about', idx, 'phone'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <TextField
                            label='Email'
                            value={item.email || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['about', idx, 'email'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {section.content?.menuColumns?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant='h6'>Menu cột chân trang</Typography>
                      {section.content.menuColumns.map((col, idx) => (
                        <Box
                          key={idx}
                          sx={{ mt: 2, border: '1px solid #eee', p: 2 }}
                        >
                          <TextField
                            label='Tiêu đề'
                            value={col.title || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['menuColumns', idx, 'title'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          {/* Nếu có subtitle hoặc text */}
                          {col.subtitle !== undefined && (
                            <TextField
                              label='Phụ đề'
                              value={col.subtitle || ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  section.key,
                                  ['menuColumns', idx, 'subtitle'],
                                  e.target.value
                                )
                              }
                              fullWidth
                              margin='dense'
                            />
                          )}
                          {col.text !== undefined && (
                            <TextField
                              label='Nội dung'
                              value={col.text || ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  section.key,
                                  ['menuColumns', idx, 'text'],
                                  e.target.value
                                )
                              }
                              fullWidth
                              margin='dense'
                            />
                          )}
                          {col.items && Array.isArray(col.items) && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant='subtitle1'>
                                Liên kết:
                              </Typography>
                              {col.items.map((item, itemIdx) => (
                                <Box key={itemIdx} sx={{ mt: 1 }}>
                                  <TextField
                                    label={`Nhãn ${itemIdx + 1}`}
                                    value={item.label || ''}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        section.key,
                                        [
                                          'menuColumns',
                                          idx,
                                          'items',
                                          itemIdx,
                                          'label'
                                        ],
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                    margin='dense'
                                  />
                                  <TextField
                                    label={`Link ${itemIdx + 1}`}
                                    value={item.link || ''}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        section.key,
                                        [
                                          'menuColumns',
                                          idx,
                                          'items',
                                          itemIdx,
                                          'link'
                                        ],
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                    margin='dense'
                                  />
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {section.content?.socialLinks?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant='h6'>Liên kết mạng xã hội</Typography>
                      {section.content.socialLinks.map((link, idx) => (
                        <Box
                          key={idx}
                          sx={{ mt: 2, border: '1px solid #eee', p: 2 }}
                        >
                          <TextField
                            label='Biểu tượng (VD: facebook, instagram)'
                            value={link.image || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['socialLinks', idx, 'image'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                          <TextField
                            label='Liên kết'
                            value={link.link || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                section.key,
                                ['socialLinks', idx, 'link'],
                                e.target.value
                              )
                            }
                            fullWidth
                            margin='dense'
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {section.content?.copyright && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant='h6'>Copyright</Typography>
                      <TextField
                        label='Nội dung'
                        value={section.content?.copyright || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            section.key,
                            ['copyright'],
                            e.target.value
                          )
                        }
                        fullWidth
                        multiline
                        margin='dense'
                      />
                    </Box>
                  )}

                  <Button
                    variant='contained'
                    color='primary'
                    sx={{ mt: 2 }}
                    onClick={() => handleSave(section.key)}
                  >
                    Lưu nội dung
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )
      )}
    </div>
  )
}
