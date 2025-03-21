import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import { Button, DialogActions, DialogContent, DialogTitle, ModalClose } from '@mui/joy'
import Divider from '@mui/joy/Divider'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom'

export default function SuccessModal(props: {
    open: boolean
    onClose: () => void
    title?: string
    message: string
}) {
    const navigate = useNavigate()

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <ModalDialog
                color="success"
                variant="outlined"
            >
                <ModalClose />
                <DialogTitle>
                    <CheckCircleOutline />
                    {props.title ?? 'Success'}
                </DialogTitle>
                <Divider />
                <DialogContent>{props.message}</DialogContent>
                <DialogActions>
                    <Button
                        variant="solid"
                        onClick={() => {
                            props.onClose()
                            navigate('/')
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}
