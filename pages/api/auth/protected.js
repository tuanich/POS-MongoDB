// pages/protected.js
import { useSession, getSession } from 'next-auth/react';

export default function ProtectedPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <p>Loading...</p>;
    if (!session) return <p>Access Denied</p>;

    return (
        <div>
            <h1>Protected Page</h1>
            <p>Welcome, {session.user.name}</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}