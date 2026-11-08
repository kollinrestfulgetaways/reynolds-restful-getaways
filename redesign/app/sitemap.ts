import {siteUrl,guides} from '@/lib/content';
import {features} from '@/lib/features';
export default function sitemap(){return ['',...(features.consultations?['consultations']:[]),'cards','guides','shop','about','contact','disclosure','privacy','terms',...guides.map(g=>'guides/'+g.slug)].map(p=>({url:siteUrl+'/'+p,lastModified:'2026-11-07',changeFrequency:'monthly' as const,priority:p?0.7:1}));}
