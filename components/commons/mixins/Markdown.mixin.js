import marked from 'marked';
import DOMPurify from 'dompurify';

export default {
    methods: {
        md(markdownInput) {
            const html = marked(markdownInput);
            const cleanHtml = DOMPurify.sanitize(html);
            return cleanHtml;
        }
    }
};
