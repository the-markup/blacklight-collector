import { dedupLinks, getSocialLinks } from '../src/pptr-utils/get-links';
import { SOCIAL_URLS } from '../src/helpers/statics';
import { LinkObject } from '../src/types';

describe('get-links', () => {
    describe('dedupLinks', () => {
        it('removes duplicates from an array of links', () => {
            const links:LinkObject[] = [
                {
                    href: "www.url1.com",
                    innerHtml: "html",
                    innerText: "Hello, world"
                },
                {
                    href: "www.url1.com",
                    innerHtml: "html",
                    innerText: "Hello, world"
                },
                {
                    href: "www.url2.com",
                    innerHtml: "html2",
                    innerText: "bah bah black sheep"
                }
            ];
            const result = dedupLinks(links);
            expect(result.length).toBe(2);
            expect(result).toStrictEqual([
                {
                    href: "www.url1.com",
                    innerHtml: "html",
                    innerText: "Hello, world"
                },
                {
                    href: "www.url2.com",
                    innerHtml: "html2",
                    innerText: "bah bah black sheep"
                }
            ]);
        });
        it('returns original array of links if no duplicates', () => {
            const links: LinkObject[] = [
                {
                    href: "www.url1.com",
                    innerHtml: "html",
                    innerText: "Hello, world"
                },
                {
                    href: "www.url2.com",
                    innerHtml: "html2",
                    innerText: "bah bah black sheep"
                }
            ];
            const result = dedupLinks(links);
            expect(result).toHaveLength(2);
            expect(result).toStrictEqual(links);
        });
    });

    describe('getSocialLinks', () => {
        it('filters out only social links from a list of LinkObjects', () => {
            const links:LinkObject[] = [
                {
                    href: 'url1.com',
                    innerHtml: 'html',
                    innerText: 'hello world!'
                },
                {
                    href: 'www.facebook.com',
                    innerHtml: 'facebook',
                    innerText: 'fb'
                },
                {
                    href: 'www.x.com',
                    innerHtml: 'x',
                    innerText: 'x'
                }
            ];
            const results = getSocialLinks(links);
            expect(results).toHaveLength(2);
            expect(results).toStrictEqual([
                {
                    href: 'www.facebook.com',
                    innerHtml: 'facebook',
                    innerText: 'fb'
                } ,
                {
                    href: 'www.x.com',
                    innerHtml: 'x',
                    innerText: 'x'
                }
            ]);
        });
        it('doesn\'t recognize urls ending in a social url', () => {
            const links = [
                {
                    href: 'www.x.com',
                    innerHtml: 'x',
                    innerText: 'x'
                },
                {
                    href: 'x.com',
                    innerHtml: 'x',
                    innerText: 'x'
                },
                {
                    href: 'www.fix.com',
                    innerHtml: 'fix',
                    innerText: 'fix'
                },
                {
                    href: 'fix.com',
                    innerHtml: 'fix',
                    innerText: 'fix'
                }
            ];
            const results = getSocialLinks(links);
            expect(results).toHaveLength(2);
            expect(results).toStrictEqual([
                {
                    href: 'www.x.com',
                    innerHtml: 'x',
                    innerText: 'x'
                },
                {
                    href: 'x.com',
                    innerHtml: 'x',
                    innerText: 'x'
                },
            ]);
        });
        it('returns original array if it contains only social links', () => {
            const links = [
                {
                    href: 'www.evernote.com',
                    innerHtml: 'evernote',
                    innerText: 'evernote'
                },
                {
                    href: 'www.tiktok.com',
                    innerHtml: 'tiktok',
                    innerText: 'tiktok'
                }
            ];
            const result = getSocialLinks(links);
            expect(result).toHaveLength(links.length);
            expect(result).toStrictEqual(links);
        });
        it('recognizes every social link', () => {
            // SOCIAL_URLS escapes the . character for regex safety. 
            // We have to remove that escaping here, where it's interpreted as a plain string
            const links:LinkObject[] = SOCIAL_URLS.map(url => {
                return { 
                    href: `www.${url.replaceAll('\\', '')}`, 
                    innerText: 'text', 
                    innerHtml: 'html'
                };
            });
            const result = getSocialLinks(links);
            expect(result).toHaveLength(links.length);
            expect(result).toStrictEqual(links);
        });
        it('recognizes different versions of a social link', () => {
            const links = [
                {
                    href: 'snapchat.com',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'www.snapchat.com',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'http://snapchat.com',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'https://snapchat.com',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'http://www.snapchat.com',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'snapchat.com/page',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'www.snapchat.com/page',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                },
                {
                    href: 'subdomain.snapchat.com/page',
                    innerHtml: 'snapchat',
                    innerText: 'snapchat'
                }
            ];
            const results = getSocialLinks(links);
            expect(results).toHaveLength(links.length);
            expect(results).toStrictEqual(links);
        });
    });
});