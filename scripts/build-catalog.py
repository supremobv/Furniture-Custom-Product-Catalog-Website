"""Build SORA's downloadable concept catalog. Requires reportlab and Pillow.
Run export-catalog-data.mjs first; the JSON is derived from app/catalog-data.ts.
"""
from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image

ROOT=Path(__file__).resolve().parent.parent
DATA=json.loads((ROOT/'outputs/catalog-data.json').read_text(encoding='utf-8'))
OUT=ROOT/'public/catalogs/sora-collection.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
# Windows fonts are used only for producing this bundled, static PDF.
FONTS=Path('C:/Windows/Fonts')
for name,file in [('Body','arial.ttf'),('Serif','georgia.ttf'),('Italic','georgiai.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONTS/file)))
W,H=595.28,841.89
INK=HexColor('#38392f'); MUTED=HexColor('#77776c'); PAPER=HexColor('#f8f6f0'); DARK=HexColor('#3c4033'); LINE=HexColor('#dcdcd2')
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('SORA - The Concept Collection 2026');c.setAuthor('SORA Furniture & Objects')
def text(x,y,s,size=10,font='Body',color=INK):
    c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,s)
def para(s,x,y,width=495,size=10,color=MUTED,font='Body',leading=None):
    style=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.65,textColor=color)
    p=Paragraph(s,style);_,height=p.wrap(width,H);p.drawOn(c,x,y-height);return y-height
def photo(name,x,y,w,h):
    with Image.open(ROOT/f'public/images/{name}.jpg') as im:
        iw,ih=im.size;r=max(w/iw,h/ih);nw,nh=w/r,h/r
        left=(iw-nw)/2;top=(ih-nh)/2
        crop=im.crop((left,top,left+nw,top+nh))
        c.drawImage(ImageReader(crop),x,y,w,h,mask='auto')
def base(page,label):
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    text(42,H-45,'sora',24,'Serif');text(350,H-43,label,7,color=MUTED)
    c.setStrokeColor(LINE);c.line(42,39,W-42,39)
    text(42,25,'SORA / THE CONCEPT COLLECTION 2026',6.5,color=MUTED)
    text(W-61,25,str(page).zfill(2),7,color=MUTED)
def currency(n):return f'PHP {n:,.0f}'
# Cover
c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
text(42,H-64,'sora',49,'Serif');text(43,H-88,'FURNITURE & OBJECTS',8,color=MUTED)
text(42,H-172,'Objects for',44,'Serif');text(42,H-223,'everyday living.',44,'Italic',HexColor('#7e806a'))
photo('lounge',42,145,W-84,400)
text(42,107,'THE CONCEPT COLLECTION / 2026',9)
para('Eight considered starting points. Material possibilities. Room for your ideas.',42,85,size=9)
text(42,34,'Illustrative stock imagery and sample specifications. Not verified inventory.',7,color=MUTED)
c.showPage()
# Four paired product spreads
for index in range(4):
    base(index+2,'THE COLLECTION / SAMPLE SPECIFICATIONS')
    for row,p in enumerate(DATA['products'][index*2:index*2+2]):
        top=H-92-row*345
        photo(p['image'],42,top-255,218,255)
        x=284; width=269
        text(x,top-4,f"{p['code']} / {p['category'].upper()}",7,color=MUTED)
        y=para(p['name'],x,top-23,width,25,INK,'Serif',29)-13
        y=para(p['description'],x,y,width,9)-17
        text(x,y,'SAMPLE DIMENSIONS',6.5,color=MUTED);y-=16
        text(x,y,p['dimensions'].replace('×','x'),8.5);y-=25
        text(x,y,'MATERIAL DIRECTIONS',6.5,color=MUTED);y-=11
        names=[m['name'] for m in DATA['materials'] if m['id'] in p['materials']]
        y=para(' / '.join(names),x,y,width,8.5,INK)-17
        text(x,y,'FINISH DIRECTIONS',6.5,color=MUTED);y-=17
        xx=x
        for f in DATA['finishes']:
            if f['id'] in p['finishes']:
                c.setFillColor(HexColor(f['color']));c.circle(xx+5,y,5,fill=1,stroke=0)
                text(xx+15,y-3,f['name'],7,color=MUTED);xx+=86
        y-=30;text(x,y,'FROM '+currency(p['price']),11)
        if y<top-305:raise ValueError('Product text exceeds page region: '+p['id'])
    para('Photographs are design references. Product names, sizes, construction, and prices are samples. Final specifications, delivery, tax, and installation require a written maker quote.',42,104,511,7)
    c.showPage()
# Materials / custom process
base(6,'MATERIAL POSSIBILITIES / YOUR CUSTOM BRIEF')
text(42,H-113,'A little more personal.',32,'Italic',HexColor('#7e806a'))
y=para('A warmer grain. A softer tone. Start with the direction that feels right, then confirm physical samples before approving your piece.',42,H-139,500,11)-35
for m in DATA['materials']:
    c.setFillColor(HexColor(m['color']));c.rect(42,y-49,68,53,fill=1,stroke=0)
    text(130,y-8,m['name'],15,'Serif')
    para(m['note'],130,y-20,420,9)
    y-=82
text(42,y-5,'FROM IDEA TO AGREED DETAILS',8);y-=27
for n,title,body in [('01','Share your idea.','Choose a starting piece or describe a custom furniture or cabinetry project.'),('02','Find the right fit.','Prepare dimensions, quantity, delivery area, budget, and a material direction.'),('03','Agree before production.','Confirm drawings, samples, a written quote, construction, and the timeline with your maker.')]:
    text(42,y,n,9,color=MUTED);text(76,y,title,14,'Serif');y=para(body,76,y-9,477,9)-22
para('SORA is a demonstration studio. Inquiries do not confirm orders, take payment, or commit to production. On-screen swatches are illustrative and do not recolor reference photos.',42,132,511,8)
c.linkURL('https://sora-furniture-custom-studio.sunset-loon-7325.chatgpt.site/#bespoke',(42,60,553,87),relative=0,thickness=0)
text(42,74,'START YOUR CUSTOM BRIEF / OPEN THE SORA WEBSITE',8)
c.showPage()
# Photography and concept notes
base(7,'PHOTOGRAPHY / CONCEPT NOTES')
text(42,H-115,'The details behind the ideas.',30,'Serif')
y=para('SORA is an illustrative furniture studio, not a claim of a real manufacturer. Stock photos and renderings represent design inspiration. Product names, dimensions, material options, and PHP prices are samples; they do not establish the identity or actual construction of the photographed subjects.',42,H-145,511,10)-25
photos=[('25857376','Pușcaș Adryan','Lounge chair reference / stock rendering'),('29149090','Pexels contributor','Sofa reference'),('8251247','PNW Production','Pale cabinet reference'),('6758235','Max Vakhtbovych','Rounded cabinet reference'),('30440152','Jyoti Mishra','Coffee table reference'),('11112728','Ksenia Chernaya','Wood chair reference'),('10847177','Đỗ Huy Hoàng','Dining table reference'),('8146216','Max Vakhtbovych','Shelving reference'),('5710747','Anna Shvets','Workshop reference')]
for pid,by,role in photos:
    text(42,y,role,10,'Serif');text(42,y-17,f'Pexels / {by} / Photo {pid}',8,color=MUTED)
    c.linkURL(f'https://www.pexels.com/photo/{pid}/',(42,y-20,553,y+10),relative=0,thickness=0)
    c.setStrokeColor(LINE);c.line(42,y-30,553,y-30);y-=48
para('Images are cropped for page layout. Visit the website photography credits for original source links. Pexels license: https://www.pexels.com/license/',42,98,511,8)
c.save()
print(str(OUT))
