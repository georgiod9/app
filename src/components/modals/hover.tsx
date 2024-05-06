import { forwardRef } from 'react';

interface QModalProps {
    text: string
}

const QModal = forwardRef<HTMLDivElement, QModalProps>(({ text }, ref) => {

    return (
        <>
            <div className="absolute w-fit h-fit bg-red rounded-lg bg-opacity-100 z-50 flex justify-center items-center">
                <p className="text-[#0d0d0d] text-xs font-[400] p-1">{text}</p>
            </div>
        </>
    )
})

export default QModal
