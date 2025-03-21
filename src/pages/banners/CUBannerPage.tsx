import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Button } from '@mui/joy'
import Textarea from '@mui/joy/Textarea'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import BannerService from '../../services/banner.service.ts'
import BackButton from '../../components/BackButton.tsx'
import SuccessModal from '../../components/SuccessModal.tsx'

export default function CUBannerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  // Form fields
  const [link, setLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  // Control the success modal
  const [successOpen, setSuccessOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    BannerService.getBanner(id!).then((banner) => {
      if (!banner) {
        alert('Banner not found!')
        navigate('/banners')
      } else {
        setLink(banner.link)
        setImageUrl(banner.imageUrl)
        setDescription(banner.description ?? '')
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false))
  }, [isEdit, id, navigate])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      if (isEdit) {
        await BannerService.updateBanner(id!, { id, link, imageUrl, description })
        setSuccessMessage('Banner updated successfully!')
      } else {
        await BannerService.createBanner({ link, imageUrl, description })
        setSuccessMessage('Banner created successfully!')
      }
      setSuccessOpen(true)
    } catch (error) {
      console.error('Failed to save banner!', error)
      alert(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64String = ev.target?.result as string
      setImageUrl(base64String)
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return <p>Loading banner data...</p>
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        my: 4,
        p: { xs: 0, sm: 2 },
      }}
    >
      <BackButton />
      <Card variant="outlined">
        <Typography level="h4" sx={{ mb: 2 }}>
          {isEdit ? 'Edit Banner' : 'Create a New Banner'}
        </Typography>
        <CardContent
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Title Field */}
          <FormControl required>
            <FormLabel>Banner Title</FormLabel>
            <Input
              placeholder="Enter banner title"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <FormHelperText>
              The name of the banner or company for which it is made.
            </FormHelperText>
          </FormControl>

          {/* Description field */}
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Describe the banner or usage"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
            />
            <FormHelperText>(Optional) Additional details.</FormHelperText>
          </FormControl>

          {/* Image File Field */}
          <FormControl required={!isEdit}>
            <FormLabel>Choose Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              sx={{
                backgroundColor: 'background.surface',
                padding: 1,
                borderRadius: 'md',
              }}
            />
            <FormHelperText>Choose a banner from your device.</FormHelperText>
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" variant="solid" color="primary">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </CardContent>
      </Card>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
        }}
        message={successMessage}
      />
    </Box>
  )
}
