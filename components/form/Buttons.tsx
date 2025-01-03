'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FaRegTrashCan, FaPenToSquare } from 'react-icons/fa6';

// these types provide the ability to set
// values as enums. Props will default to 'sm'

type btnSize = 'default' | 'lg' | 'sm';
type SubmitButtonProps = {
    className?: string;
    text?: string;
    size?: btnSize;
};

// NOTE: size is optional, defaults to 'sm'
export function SubmitButton({
    className = '',
    text = 'submit',
    size = 'sm',
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type='submit'
            disabled={pending}
            className={`capitalize ${className} `}
            size={size}
        >
            {pending ? (
                <>
                    <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                    Please wait...
                </>
            ) : (
                text
            )}
        </Button>
    );
}

export const CardSignInButton = () => {
    return (
        <SignInButton mode='modal'>
            <Button
                type='button'
                size='icon'
                variant='outline'
                className='p-2 cursor-pointer'
                asChild
            >
                <FaRegHeart />
            </Button>
        </SignInButton>
    );
};

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
    const { pending } = useFormStatus();
    return (
        <Button
            type='submit'
            size='icon'
            variant='outline'
            className='p-2 cursor-pointer'
        >
            {pending ? (
                <ReloadIcon className='animate-spin' />
            ) : isFavorite ? (
                <FaHeart />
            ) : (
                <FaRegHeart />
            )}
        </Button>
    );
};

type actionType = 'edit' | 'delete';
export const IconButton = ({ actionType }: { actionType: actionType }) => {
    const { pending } = useFormStatus();

    const renderIcon = () => {
        switch (actionType) {
            case 'edit':
                return <FaPenToSquare />;
            case 'delete':
                return <FaRegTrashCan />;
            default:
                const never: never = actionType;
                throw new Error(`Invalid action type: ${never}`);
        }
    };

    return (
        <Button
            type='submit'
            size='icon'
            variant='link'
            className='p-2 cursor-pointer'
        >
            {pending ? <ReloadIcon className=' animate-spin' /> : renderIcon()}
        </Button>
    );
};
