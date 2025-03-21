import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Button, Card, CardActions, CardOverflow, Grid, Skeleton, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import { Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Image from '../../components/Image.tsx'
import BannerService from '../../services/banner.service.ts'

import ConfirmModal from '../../components/ConfirmModal.tsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { usePageData } from '../../context/page-data/page-data.context.ts'

export default function Banner() {
    const { setPageData } = usePageData()
    useEffect(() => {
        setPageData({ title: 'Banner Page' })
    }, [setPageData])

    const { id } = useParams()
    const navigate = useNavigate()

    // Local state for the banner
    const [banner, setBanner] = useState<BannerDto | null>(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    // Load banner from localStorage
    useEffect(() => {
        if (!id) return
        BannerService.getBanner(id).then((res) => {
            if (!res) {
                alert('Banner not found!')
                navigate('/banners')
            } else {
                setBanner(res)
            }
        })
    }, [id, navigate])

    // Called when user confirms delete
    async function handleConfirmDelete() {
        if (!banner) return
        try {
            await BannerService.deleteBanner(banner.id!)
            navigate('/banners') // or do something else after deletion
        } catch (error) {
            console.error('Failed to delete banner:', error)
        }
    }

    // If still loading or banner not found
    if (!banner) {
        return <p>Loading banner...</p>
    }

    // If banner is loaded, render
    return (
        <Grid
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
            gap={"30px"}
        >
            <h1>ID: {id}</h1>
            <Card sx={{ maxHeight: 500, width: 500 }}>
                <CardOverflow>
                    <Image url={banner.imageUrl} />
                </CardOverflow>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            level="title-lg"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                            }}
                        >
                            <Skeleton
                                loading={!banner}
                                variant="text"
                                sx={{ width: '100%', height: '100%' }}
                            >
                                {banner.link}
                            </Skeleton>
                        </Typography>
                    </Box>
                </Box>
                <CardActions>
                    <IconButton
                        variant="outlined"
                        size="sm"
                        sx={{ width: '20%', alignSelf: 'center' }}
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Delete />
                    </IconButton>
                    <Button
                        variant="solid"
                        type="button"
                        size="md"
                        onClick={() => navigate(`/banners/${banner.id}/edit`)}
                        color="primary"
                        sx={{ width: '75%', alignSelf: 'center', fontWeight: 600 }}
                    >
                        Edit
                    </Button>
                </CardActions>
            </Card>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                confirm={handleConfirmDelete}
                action="delete this banner"
            />
        </Grid>
    )
}
