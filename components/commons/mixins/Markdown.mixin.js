import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import MarkdownItEmoji from 'markdown-it-emoji';
const mdIt = new MarkdownIt({
    breaks: true
});
mdIt.use(MarkdownItEmoji);

export default {
    methods: {
        md(markdownInput) {
            const html = mdIt.render(markdownInput);
            const cleanHtml = DOMPurify.sanitize(html);
            return cleanHtml;
        }
    }
};
