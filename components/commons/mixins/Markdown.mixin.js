import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import MarkdownItEmoji from 'markdown-it-emoji';
import markdownitTaskLists from 'markdown-it-task-lists';
const mdIt = new MarkdownIt({
    breaks: true
});
mdIt.use(MarkdownItEmoji);
mdIt.use(markdownitTaskLists, { enabled: true });

export default {
    methods: {
        md(markdownInput) {
            const html = mdIt.render(markdownInput);
            const cleanHtml = DOMPurify.sanitize(html);
            return cleanHtml;
        },
        mdInput(markdownInput) {
            const html = mdIt.render(markdownInput);
            const cleanHtml = DOMPurify.sanitize(html);
            const vuetifiedHtml = this.vuetifyHtml(cleanHtml);
            return vuetifiedHtml;
        },
        vuetifyHtml(html) {
            const taskListInputMask = 'class="task-list-item-checkbox"';
            let i = 0;
            const vuetifiedHtml = html.replaceAll(taskListInputMask, () => {
                return `num="${++i}" class="task-list-item-checkbox" @click="clickCheckbox"`;
            });
            return vuetifiedHtml;
        }
    }
};
