import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const downloadDocumentPdf = async (element: HTMLElement, title: string) => {
  const clone = element.cloneNode(true) as HTMLElement;
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;pointer-events:none';
  clone.removeAttribute('id');
  clone.querySelectorAll('button, [data-pdf-exclude]').forEach(node => node.remove());
  clone.style.cssText = 'width:800px;max-width:none;margin:0;padding:32px;background:#fff;color:#08111f;border:1px solid #d7e2f0;border-radius:0;box-shadow:none;backdrop-filter:none;font-family:Arial,Helvetica,sans-serif';
  const logo = clone.querySelector<HTMLElement>('[data-invoice-logo]');
  if (logo) {
    logo.style.width = '64px';
    logo.style.height = '64px';
    logo.style.objectFit = 'contain';
    logo.style.flexShrink = '0';
  }
  clone.querySelectorAll<HTMLElement>('*').forEach(node => {
    node.style.color = node.matches('dt, .text-slate-400, .text-slate-500') ? '#5b6b80' : '#08111f';
    node.style.borderColor = '#d7e2f0';
    if (node.className.includes('bg-emerald')) node.style.background = '#e6fffa';
  });
  const details = clone.querySelector('dl');
  if (details) details.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    await document.fonts.ready;
    await Promise.all(Array.from(clone.querySelectorAll<HTMLImageElement>('img')).map(image => image.complete
      ? Promise.resolve()
      : new Promise<void>(resolve => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      })));
    const bounds = clone.getBoundingClientRect();
    // Keep detail fields, item rows and totals together across page breaks.
    const blocks = Array.from(clone.querySelectorAll<HTMLElement>(':scope > div:first-child, dl > div, li, :scope > div:last-child > div'))
      .map(node => {
        const rect = node.getBoundingClientRect();
        return { top: rect.top - bounds.top, bottom: rect.bottom - bounds.top };
      });
    const canvas = await toCanvas(clone, { pixelRatio: 2, backgroundColor: '#ffffff', skipFonts: true });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    pdf.setProperties({ title });
    const margin = 12;
    const width = pdf.internal.pageSize.getWidth() - margin * 2;
    const height = pdf.internal.pageSize.getHeight() - margin * 2;
    const scale = canvas.width / bounds.width;
    const pageHeight = Math.floor(height * canvas.width / width);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    const context = pageCanvas.getContext('2d');
    if (!context) throw new Error('Unable to render invoice PDF');

    let offset = 0;
    while (offset < canvas.height) {
      let end = Math.min(offset + pageHeight, canvas.height);
      if (end < canvas.height) {
        const crossing = blocks.filter(block => block.top * scale < end && block.bottom * scale > end);
        const breakBefore = Math.floor(Math.min(...crossing.map(block => block.top * scale)));
        if (breakBefore > offset && breakBefore < end) end = breakBefore;
      }
      pageCanvas.height = end - offset;
      context.drawImage(canvas, 0, offset, canvas.width, pageCanvas.height, 0, 0, canvas.width, pageCanvas.height);
      if (offset > 0) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, width, pageCanvas.height * width / canvas.width);
      offset = end;
    }

    const filename = Array.from(title, char => char.charCodeAt(0) < 32 ? '-' : char)
      .join('').replace(/[<>:"/\\|?*]/g, '-').trim() || 'invoice';
    await pdf.save(`${filename}.pdf`, { returnPromise: true });
  } finally {
    container.remove();
  }
};

export const downloadInvoicePdf = downloadDocumentPdf;
