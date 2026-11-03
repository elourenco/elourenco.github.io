"""Generate the website's bilingual PDFs. Requires Python 3 and reportlab.

Source: the previously published Portuguese CV and current website position.
Dates and historical roles are preserved; the current role has no inferred start date.
Run: python3 scripts/generate-resumes.py
"""

import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    PageBreak,
    SimpleDocTemplate,
)

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "scripts/resume-content.json").read_text())
INK = colors.HexColor("#17231d")
GREEN = colors.HexColor("#28543b")
STYLES = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=INK),
    "role": ParagraphStyle("role", fontName="Helvetica", fontSize=11, leading=16, textColor=GREEN),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.2, leading=12, textColor=INK, spaceAfter=5),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=GREEN, spaceBefore=9, spaceAfter=8),
    "position": ParagraphStyle("position", fontName="Helvetica-Bold", fontSize=9.5, leading=12.5, textColor=INK, spaceBefore=5, keepWithNext=True),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=8.5, leading=11, textColor=colors.HexColor("#48564e"), spaceAfter=4, alignment=TA_LEFT),
}


def paragraph(text, style="body"):
    return Paragraph(text, STYLES[style])


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#ccd6cf"))
    canvas.line(40, 34, A4[0] - 40, 34)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREEN)
    canvas.drawString(40, 22, "Eduardo Lourenco | eduardolourenco.dev")
    canvas.drawRightString(A4[0] - 40, 22, str(doc.page))
    canvas.restoreState()


def generate(locale, content):
    target = ROOT / "public" / content["filename"]
    doc = SimpleDocTemplate(
        str(target), pagesize=A4, leftMargin=40, rightMargin=40,
        topMargin=34, bottomMargin=44, title=f'{DATA["name"]} - {content["experienceTitle"]}',
        author=DATA["name"], lang=locale, invariant=1,
    )
    story = [paragraph(escape(DATA["name"]), "name"), paragraph(DATA["title"], "role")]
    story.append(paragraph(f'{escape(content["location"])} | {DATA["phone"]} | <link href="mailto:{DATA["email"]}">{DATA["email"]}</link>', "meta"))
    story.append(paragraph('<link href="https://eduardolourenco.dev">eduardolourenco.dev</link> | <link href="https://www.linkedin.com/in/dudulourenco">linkedin.com/in/dudulourenco</link> | <link href="https://github.com/elourenco">github.com/elourenco</link>', "meta"))
    for heading, entries in [(content["educationTitle"], content["education"]), (content["projectsTitle"], content["projects"])]:
        story.append(paragraph(escape(heading), "section"))
        for label, text in entries:
            story.append(paragraph(f'<b>{escape(label)}</b> - {escape(text)}'))
    story.extend([PageBreak(), paragraph(escape(content["experienceTitle"]), "section")])
    for company, period, role, text in content["experience"]:
        story.append(KeepTogether([
            paragraph(f'{escape(company)} | {escape(period)}', "position"),
            paragraph(escape(role), "meta"),
            paragraph(escape(text)),
        ]))
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(target)


if __name__ == "__main__":
    for language, localized_content in DATA["locales"].items():
        generate(language, localized_content)
