type LinkObject = {
    href: string,
    innerHtml: string,
    innerText: string
}

export const getLinks = async (page): Promise<LinkObject[]> => {
    return page.evaluate(() => {
        try {
            return [].map
                .call(document.querySelectorAll('a[href]'), a => {
                    return {
                        href: a.href.split('#')[0], // link without fragment
                        inner_html: a.innerHTML.trim(),
                        inner_text: a.innerText
                    };
                })
                .filter(link => {
                    return link.href.startsWith('http') && !link.href.endsWith('.pdf') && !link.href.endsWith('.zip');
                });
        } catch (error) {
            return [];
        }
    });
};

// https://dev.to/vuevixens/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
export const dedupLinks = (links_with_duplicates: LinkObject[]) => {
    const links = Array.from(new Set(links_with_duplicates.filter(f => f && f.hasOwnProperty('href')).map(link => link.href))).map(href => {
        return links_with_duplicates.find(link => link.href === href);
    });

    return links;
};

const SOCIAL_URLS = [
    'facebook.com',
    'linkedin.com',
    'twitter.com',
    'youtube.com',
    'instagram.com',
    'flickr.com',
    'tumblr.com',
    'snapchat.com',
    'whatsapp.com',
    'docs.google.com',
    'goo.gl',
    'pinterest.com',
    'bit.ly',
    'plus.google.com',
    'evernote.com',
    'eventbrite.com',
    'dropbox.com',
    'slideshare.net',
    'vimeo.com'
];

export const getSocialLinks = (links: LinkObject[]): LinkObject[] => {
    const spRegex = new RegExp(`\\b(${SOCIAL_URLS.join('|')})\\b`, 'i');
    return links.filter(link => {
        return link.href.match(spRegex);
    });
};
