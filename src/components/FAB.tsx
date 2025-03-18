import { Button } from '@mui/joy'
import Add from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

export default function FAB() {
    const navigate = useNavigate()
    return (
        <Button
            onClick={() => navigate('/banners/create')}
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
                borderRadius: '50%',
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
            <Add />
        </Button>
    )
}
