import { useTranslations } from 'next-intl';
import { NavigationLink } from './navigationLink';

export function Navigation() {
    const t = useTranslations('Navigation');

    return (
        <div className='inline-flex gap-4 h-12'>
            <NavigationLink href="/">{t('labelhome')}</NavigationLink>
            <NavigationLink href="/">{t('labelAboutUs')}</NavigationLink>
            <NavigationLink href="/">{t('labelProjects')}</NavigationLink>
            <NavigationLink href="/contact">{t('labelContact')}</NavigationLink>
            <NavigationLink href="/blog">{t('labelBlog')}</NavigationLink>
        </div>
    );
}