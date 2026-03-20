import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN || process.env.CLOUDFRONT_DOMAIN;
const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;
const PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY?.replace(/\\n/g, '\n');

export function generateSignedVideoUrl(videoPath) {
    if (!CLOUDFRONT_DOMAIN || !KEY_PAIR_ID || !PRIVATE_KEY) {
        console.error("CloudFront config missing");
        return null;
    }

    const url = `https://${CLOUDFRONT_DOMAIN}/${videoPath}`;
    const dateLessThan = new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(); // 2 hours expiry

    try {
        const signedUrl = getSignedUrl({
            url,
            keyPairId: KEY_PAIR_ID,
            privateKey: PRIVATE_KEY,
            dateLessThan,
        });
        return signedUrl;
    } catch (error) {
        console.error("Error signing CloudFront URL", error);
        return null;
    }
}
