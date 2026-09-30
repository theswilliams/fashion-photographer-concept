// Booking sheet: validates inline, then shows a labelled "nothing was sent" confirmation.
export function initBook() {
  const form = document.querySelector<HTMLFormElement>('#sheet');
  if (!form) return;
  const issued = document.querySelector<HTMLElement>('#issued')!;
  const summary = form.querySelector<HTMLElement>('[data-summary]')!;

  const rules: Record<string, (v: string) => string> = {
    production: (v) => (v.trim() ? '' : 'Name the production or brand.'),
    contact: (v) => (v.trim() ? '' : 'Add a name to call.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter an email like name@studio.example.'),
    brief: (v) => (v.trim().length >= 20 ? '' : 'Two lines on the shoot, at least 20 characters.'),
  };

  const check = (name: string) => {
    const el = form.elements.namedItem(name) as HTMLInputElement;
    const err = form.querySelector<HTMLElement>(`#err-${name}`)!;
    const msg = rules[name](el.value);
    err.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.cell')?.classList.toggle('is-bad', !!msg);
    return msg;
  };

  Object.keys(rules).forEach((n) => {
    const el = form.elements.namedItem(n) as HTMLInputElement;
    el.addEventListener('blur', () => check(n));
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') check(n);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((n) => check(n));
    if (bad.length) {
      summary.textContent = `${bad.length} field${bad.length > 1 ? 's need' : ' needs'} attention.`;
      (form.elements.namedItem(bad[0]) as HTMLElement).focus();
      return;
    }
    summary.textContent = '';
    const ref = `CS-${Math.floor(1000 + Math.random() * 9000)}`;
    issued.querySelector('[data-ref]')!.textContent = ref;
    issued.querySelector('[data-who]')!.textContent = (form.elements.namedItem('production') as HTMLInputElement).value.trim();
    form.hidden = true;
    issued.hidden = false;
    issued.focus();
  });

  issued.querySelector('[data-edit]')!.addEventListener('click', () => {
    issued.hidden = true;
    form.hidden = false;
    (form.elements.namedItem('production') as HTMLElement).focus();
  });
}
