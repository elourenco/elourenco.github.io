import type { PortfolioContent } from '../../content';

export function ContactSection({ content }: { content: PortfolioContent }) {
  return (
    <section id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">{content.contact.title}</h2>
      <p>{content.contact.summary}</p>
      <a href="https://www.linkedin.com/in/dudulourenco">LinkedIn</a>
      <a href="https://github.com/elourenco">GitHub</a>
    </section>
  );
}
