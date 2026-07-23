import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

const withNextIntl = createNextIntlPlugin('./src/common/i18n/request.ts');

const sassOptions = {
    additionalData: `
    $var: red;
  `,
}

const experimental = {
    optimizePackageImports: [
        '@gsap/react',
        'gsap',
        '@radix-ui/themes',
        '@radix-ui/react-form',
        '@radix-ui/colors'
    ],
    serverActions: {
        allowedOrigins: []
    }
}

const compiler = {}

const onDemandEntries = {}

const nextConfig: NextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
    },
    cleanDistDir: true,
    sassOptions: {
        ...sassOptions,
        implementation: 'sass-embedded',
    },
    turbopack: {},
    compiler: {
        ...compiler,
        styledComponents: true,
    },
    productionBrowserSourceMaps: true,
    onDemandEntries: {
        ...onDemandEntries,
        maxInactiveAge: 30 * 1000,
        pagesBufferLength: 5,
    },
    experimental: {
        ...experimental,
        authInterrupts: true,
        inlineCss: true,
        optimizeCss: true,
        optimizeServerReact: true,
        scrollRestoration: true,

        parallelServerCompiles: true,
        parallelServerBuildTraces: true,
        webpackBuildWorker: true,
        webpackMemoryOptimizations: true
    },
    // output: 'export'
    // i18n: {
    //     locales: ['en', 'vi'],
    //     defaultLocale: 'en',
    // },
}

export default
    withBundleAnalyzer(
        withNextIntl(
            nextConfig
        )
    )
