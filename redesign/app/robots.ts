import {siteUrl} from '@/lib/content';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:['/studio','/api/','/go/']},sitemap:siteUrl+'/sitemap.xml'};}
