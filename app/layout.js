import '../styles/globals.css';

export const metadata = {
    title: 'Daily Sādhanā — Watch Your Daily Shloka',
    description: 'Watch your daily shloka video in English, Hindi, Tamil, Telugu, or Kannada. A companion to your 90-day Daily Sadhana journal.',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
