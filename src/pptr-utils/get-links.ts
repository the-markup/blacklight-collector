import { LinkObject } from '../types';
import { hasOwnProperty } from '../utils';
import { SOCIAL_URLS } from './default';

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
                .filter((link:LinkObject) => {
                    return (
                        link.href.startsWith('http') && 
                        !link.href.endsWith('.pdf') && 
                        !link.href.endsWith('.zip')
                    );
                });
        } catch (error) {
            return [];
        }
    });
};

// Uses Set to remove duplicates by reducing LinkObjects to their href property, deduping via Set,
// then reconstituting an array of full LinkObjects
export const dedupLinks = (links_with_duplicates: LinkObject[]):LinkObject[] => {
    const sanitized_links = links_with_duplicates.filter(f => f && hasOwnProperty(f, 'href')).map(link => link.href);
    const deduped_href_array = Array.from(new Set(sanitized_links));

    return deduped_href_array.map(href => links_with_duplicates.find(link => link.href === href));
};

export const getSocialLinks = (links: LinkObject[]): LinkObject[] => {
    const spRegex = new RegExp(`\\b(${SOCIAL_URLS.join('|')})\\b`, 'i');
    console.log(spRegex);
    return links.filter(link => {
        return link.href.match(spRegex);
    });
};
