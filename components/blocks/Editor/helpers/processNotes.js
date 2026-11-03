export function processNotes(html, prefix = 'editor') {
    const notes = [];
    const body = html.replace(/<!--note-->([\s\S]*?)<!--\/note-->/g, (_, note) => {
        const n = notes.push(note);
        const id = `${prefix}-note-${n}`;

        return (
            `<sup class="_note-ref" id="${id}-ref"><a href="#${id}">${n}</a></sup>` +
            `<span class="_sidenote" aria-hidden="true"><sup class="_note-num">${n}</sup> ${note}</span>`
        );
    });
    const hasNotes = notes.length > 0;
    const list = hasNotes
        ? `<ol class="_notes">${notes
              .map(
                  (note, i) =>
                      `<li id="${prefix}-note-${i + 1}">${note} <a href="#${prefix}-note-${i + 1}-ref" aria-label="Back to text">↩</a></li>`,
              )
              .join('')}</ol>`
        : '';

    return {
        hasNotes,
        content: body + list,
    };
}
