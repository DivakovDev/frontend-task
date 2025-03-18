import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, Button } from '@mui/joy'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import BannerService from '../../services/banner.service.ts'
import { useNavigate } from 'react-router-dom'

export default function CreateBannerPage() {
    const [link, setLink] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // Create the new banner
            await BannerService.createBanner({ link, imageUrl })

            // Clearing the form
            setLink('')
            setImageUrl('')

            // Navigate to banners list and show success message
            alert('Banner created!')
            navigate('/banners')
        } catch (error) {
            console.error('Failed to create new banner!', error)
        }
    }

    // Logic for selecting file from device
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
  
      const reader = new FileReader()
      reader.onload = (ev) => {
        const base64String = ev.target?.result as string
        setImageUrl(base64String)
      }
      reader.readAsDataURL(file)
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                my: 4, 
                p: {
                  xs: 0,
                  sm: 2,
                },
            }}
        >
            <Card variant="outlined">
                <Typography
                    level="h4"
                    sx={{ mb: 2 }}
                >
                    Create a New Banner
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
                        <FormHelperText>The name of the banner or company for which is made for.</FormHelperText>
                    </FormControl>

                    {/* Image URL Field */}
                    <FormControl required>
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
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                    >
                        Create
                    </Button>
                </CardContent>
            </Card>
        </Box>
    )
}
