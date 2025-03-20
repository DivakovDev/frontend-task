import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Button } from '@mui/joy'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import BannerService from '../../services/banner.service.ts'

export default function CUBannerPage() {
    const { id } = useParams() // With this we controll wich functionality to use  /banners/:id/edit or /banners/create
    const navigate = useNavigate()

    // State for the form fields
    const [link, setLink] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    // If we have an ID, we’re in "edit" mode
    const isEdit = Boolean(id)

    // If editing, load the existing banner data on mount
    useEffect(() => {
        if (!isEdit) return // if no id, skip
        setLoading(true)
        BannerService.getBanner(id!)
            .then((banner) => {
                if (banner) {
                    // here we change the value of the banner fields
                    setLink(banner.link)
                    setImageUrl(banner.imageUrl)
                } else {
                    alert('Banner not found!')
                    navigate('/banners')
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [isEdit, id, navigate])

    // Handle form submission for either create or edit
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            if (isEdit) {
                // Update existing banner
                await BannerService.updateBanner(id!, { id, link, imageUrl })
                alert('Banner updated!')
            } else {
                // Create a new banner
                await BannerService.createBanner({ link, imageUrl })
                alert('Banner created!')
            }
            navigate('/banners')
        } catch (error) {
            console.error('Failed to save banner!', error)
        }
    }

    // Handle file selection
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
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    )
}
