import { forwardRef } from 'react';

interface QModalProps {
    text: string;
    w: number;
}

const QModal = forwardRef<HTMLDivElement, QModalProps>(({ text, w }, ref) => {
    return (
        <>
            <div
                ref={ref}
                className={`absolute bg-red rounded-lg bg-opacity-100 z-50 p-2 text-xs text-[#0d0d0d] font-[350]`}
                style={{ width: `${w}px`, left: '50%', transform: 'translateX(-50%)', bottom: 'calc(100% + 0.5rem)' }}
            >
                {text}
            </div>
            <div className='hover-modal' />
        </>
    );
});

export default QModal
