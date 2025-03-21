import { Button } from '@mui/joy'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
    const navigate = useNavigate()
    return (
        <Button
            onClick={() => navigate('/')}
            sx={{
                position: 'fixed',
                bottom: {
                  xs: 15, 
                  sm: 30, 
                },
                right: {
                  xs: 15,
                  sm: 30,
                },
                borderRadius:"50%",
                width: {
                    xs: 56,
                    md: 72,
                  },
                height:{
                    xs: 56,
                    md: 72,
                  },
              }}
            size="lg"
        >
            <ArrowBackIcon />
        </Button>
    )
}
