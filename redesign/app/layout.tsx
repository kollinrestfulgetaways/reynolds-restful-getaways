import type { Metadata } from 'next';
import './globals.css';
import {Header,Footer} from '@/components/site';
import {siteUrl} from '@/lib/content';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Reynolds Restful Getaways | Travel more with points',template:'%s | Reynolds Restful Getaways'},description:'Practical points and miles guides, thoughtful credit card recommendations, and gear for your next adventure.',icons:{icon:'/favicon.svg'},alternates:{canonical:siteUrl},openGraph:{title:'Travel more, pay less — with points',description:'A little strategy. A world of possibility.',images:['/tokyo-pagoda.jpg'],type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
