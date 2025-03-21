import { BannerDto } from '../../services/dto/banner.dto.ts'
import { Button, Card, CardActions, CardOverflow, Grid, Skeleton, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import { Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Image from '../Image.tsx'
import BannerService from '../../services/banner.service.ts'

import ConfirmModal from '../ConfirmModal.tsx'
import { useState } from 'react'

export default function BannerCard(props: { banner?: BannerDto; delete?: () => void }) {
    const navigate = useNavigate()

    // Track whether the confirmation modal is open
    const [confirmOpen, setConfirmOpen] = useState(false)

    // This function is called when user clicks "Delete"
    async function handleConfirmDelete() {
        if (!props.banner) return
        try {
            await BannerService.deleteBanner(props.banner.id!)
            props.delete?.()
        } catch (error) {
            console.error('Failed to delete banner:', error)
        }
    }

    return (
        <Grid
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Card
                sx={{
                    maxHeight: 400,
                    width: {
                        xs: 220,
                        sm: 300,
                        md: 320,
                        lg: 335,
                    },
                }}
            >
                <CardOverflow
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        if (!props.banner) return
                        navigate(`/banners/${props.banner.id}`)
                    }}
                >
                    <Image url={props.banner?.imageUrl} />
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
                                loading={!props.banner}
                                variant="text"
                                sx={{ width: '100%', height: '100%' }}
                            >
                                {props.banner?.link}
                            </Skeleton>
                        </Typography>
                    </Box>
                </Box>
                <CardActions>
                    {/* Open the confirmation modal on click */}
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
                        onClick={() => {
                            if (!props.banner) return
                            navigate(`/banners/${props.banner.id}/edit`)
                        }}
                        color="primary"
                        sx={{ width: '75%', alignSelf: 'center', fontWeight: 600 }}
                    >
                        Edit
                    </Button>
                </CardActions>
            </Card>
            {/* ConfirmModal is shown and user make its choice */}
            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                confirm={handleConfirmDelete}
                action="delete this banner"
            />
        </Grid>
    )
}
