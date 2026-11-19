# -*- coding: utf-8 -*-
"""
Generator Laporan UTS Sistem Multimedia - Universitas Bumigora Mataram
Judul: MEDIA PEMBELAJARAN MULTIMEDIA INTERAKTIF BERBASIS WEBSITE UNTUK PENGENALAN DAN SIMULASI PERAKITAN KOMPUTER 3D (PC BUILDER 101)
Format: Sesuai struktur standar dokumen laporan akademik Ujian Tengah Semester (MDLC 6 Tahap)
Output:
- LAPORAN_UTS_SISTEM_MULTIMEDIA_PC_BUILDER_101.docx
- LAPORAN_UTS_SISTEM_MULTIMEDIA_PC_BUILDER_101.md
"""

import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCX_PATH = os.path.join(ROOT, "LAPORAN_UTS_SISTEM_MULTIMEDIA_PC_BUILDER_101.docx")
MD_PATH = os.path.join(ROOT, "LAPORAN_UTS_SISTEM_MULTIMEDIA_PC_BUILDER_101.md")

def escape_xml(s):
    return (str(s)
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&apos;"))

class DocxReportBuilder:
    def __init__(self):
        self.paragraphs = []

    def page_break(self):
        self.paragraphs.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    def p(self, text, bold=False, italic=False, size=24, align="both", before=0, after=120, line=276, indent=0):
        jc_tag = f'<w:jc w:val="{align}"/>' if align else ''
        ind_tag = f'<w:ind w:firstLine="{indent}"/>' if indent else ''
        b_tag = '<w:b/>' if bold else ''
        i_tag = '<w:i/>' if italic else ''
        
        xml = f"""<w:p>
  <w:pPr>
    {jc_tag}
    <w:spacing w:before="{before}" w:after="{after}" w:line="{line}" w:lineRule="auto"/>
    {ind_tag}
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      {b_tag}{i_tag}
      <w:sz w:val="{size}"/>
      <w:szCs w:val="{size}"/>
    </w:rPr>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      {b_tag}{i_tag}
      <w:sz w:val="{size}"/>
      <w:szCs w:val="{size}"/>
    </w:rPr>
    <w:t xml:space="preserve">{escape_xml(text)}</w:t>
  </w:r>
</w:p>"""
        self.paragraphs.append(xml)

    def p_leader(self, left_text, right_text, bold=False):
        b_tag = '<w:b/>' if bold else ''
        xml = f"""<w:p>
  <w:pPr>
    <w:tabs>
      <w:tab w:val="right" w:leader="dot" w:pos="8600"/>
    </w:tabs>
    <w:spacing w:before="30" w:after="30" w:line="240" w:lineRule="auto"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      {b_tag}
      <w:sz w:val="23"/>
      <w:szCs w:val="23"/>
    </w:rPr>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      {b_tag}
      <w:sz w:val="23"/>
      <w:szCs w:val="23"/>
    </w:rPr>
    <w:t>{escape_xml(left_text)}</w:t>
  </w:r>
  <w:r>
    <w:tab/>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      {b_tag}
      <w:sz w:val="23"/>
      <w:szCs w:val="23"/>
    </w:rPr>
    <w:t>{escape_xml(right_text)}</w:t>
  </w:r>
</w:p>"""
        self.paragraphs.append(xml)

    def h1_chapter(self, bab_num, title):
        self.p(f"BAB {bab_num}", bold=True, size=28, align="center", before=240, after=40)
        self.p(title.upper(), bold=True, size=28, align="center", before=0, after=220)

    def h2(self, text):
        self.p(text, bold=True, size=24, align="left", before=180, after=80)

    def h3(self, text):
        self.p(text, bold=True, size=24, align="left", before=120, after=50)

    def table(self, headers, rows, col_widths=None):
        if not col_widths:
            col_widths = [1000] * len(headers)
        
        xml = ['<w:tbl>',
               '<w:tblPr>',
               '<w:tblW w:w="0" w:type="auto"/>',
               '<w:tblBorders>',
               '<w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>',
               '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>',
               '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>',
               '<w:insideV w:val="none"/>',
               '</w:tblBorders>',
               '<w:tblCellMar>',
               '<w:top w:w="120" w:type="dxa"/>',
               '<w:left w:w="160" w:type="dxa"/>',
               '<w:bottom w:w="120" w:type="dxa"/>',
               '<w:right w:w="160" w:type="dxa"/>',
               '</w:tblCellMar>',
               '</w:tblPr>']
        
        # Header Row
        xml.append('<w:tr>')
        xml.append('<w:trPr><w:tblHeader/></w:trPr>')
        for idx, h in enumerate(headers):
            w = col_widths[idx] if idx < len(col_widths) else 2000
            xml.append(f"""<w:tc>
  <w:tcPr>
    <w:tcW w:w="{w}" w:type="dxa"/>
    <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
    <w:tcBorders><w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000"/></w:tcBorders>
  </w:tcPr>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="60" w:after="60"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>{escape_xml(h)}</w:t></w:r>
  </w:p>
</w:tc>""")
        xml.append('</w:tr>')

        # Body Rows
        for r_idx, row in enumerate(rows):
            bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
            xml.append('<w:tr>')
            for idx, c in enumerate(row):
                w = col_widths[idx] if idx < len(col_widths) else 2000
                align = "center" if idx == 0 or idx == 2 else "left"
                xml.append(f"""<w:tc>
  <w:tcPr>
    <w:tcW w:w="{w}" w:type="dxa"/>
    <w:shd w:val="clear" w:color="auto" w:fill="{bg}"/>
  </w:tcPr>
  <w:p>
    <w:pPr><w:jc w:val="{align}"/><w:spacing w:before="40" w:after="40"/><w:line w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/></w:rPr><w:t>{escape_xml(c)}</w:t></w:r>
  </w:p>
</w:tc>""")
            xml.append('</w:tr>')

        xml.append('</w:tbl>')
        xml.append('<w:p><w:pPr><w:spacing w:before="60" w:after="120"/></w:pPr></w:p>')
        self.paragraphs.append('\n'.join(xml))

    def save(self, filepath):
        body_xml = '\n'.join(self.paragraphs)
        document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    {body_xml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1700" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>"""

        content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

        rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

        word_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>"""

        with zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED) as z:
            z.writestr('[Content_Types].xml', content_types)
            z.writestr('_rels/.rels', rels)
            z.writestr('word/_rels/document.xml.rels', word_rels)
            z.writestr('word/document.xml', document_xml)

def generate_report():
    b = DocxReportBuilder()
    
    # ==========================================
    # HALAMAN COVER
    # ==========================================
    b.p("MEDIA PEMBELAJARAN MULTIMEDIA INTERAKTIF", bold=True, size=28, align="center", before=120, after=40)
    b.p("BERBASIS WEBSITE UNTUK PENGENALAN DAN", bold=True, size=28, align="center", before=0, after=40)
    b.p("SIMULASI PERAKITAN KOMPUTER 3D (PC BUILDER 101)", bold=True, size=28, align="center", before=0, after=240)
    
    b.p("UJIAN TENGAH SEMESTER", bold=True, size=26, align="center", before=120, after=360)
    
    b.p("[ LOGO UNIVERSITAS BUMIGORA ]", italic=True, size=22, align="center", before=180, after=360)
    
    b.p("Disusun Oleh Kelompok:", bold=True, size=24, align="center", before=120, after=120)
    
    team_members = [
        ("Muh. Farid Hakim", "2301010211"),
        ("Mauulana Habib Al Ansyori", "2301010197"),
        ("Mohamad Irfan fadhlurrahman", "2301010162"),
        ("Mohammad Syahiddin Danuwarsi Abdussamas", "2301010174"),
        ("Arya Ramadhani", "2301010208"),
        ("Nabila Umardi", "2301010165"),
        ("Muhammad Ferris Naufal", "2301010174"),
        ("Muhammad Qodri", "2301010172"),
        ("Mu'taman Abid", "2301010189"),
        ("Reno Kurniawan", "2301010175")
    ]
    
    for name, nim in team_members:
        b.p(f"{name}  :  {nim}", size=23, align="center", before=20, after=20)
        
    b.p("PROGRAM STUDI ILMU KOMPUTER", bold=True, size=26, align="center", before=360, after=40)
    b.p("FAKULTAS TEKNIK", bold=True, size=26, align="center", before=0, after=40)
    b.p("UNIVERSITAS BUMIGORA", bold=True, size=26, align="center", before=0, after=40)
    b.p("MATARAM", bold=True, size=26, align="center", before=0, after=40)
    b.p("2026", bold=True, size=26, align="center", before=0, after=120)
    
    b.page_break()
    
    # ==========================================
    # KATA PENGANTAR (ii)
    # ==========================================
    b.p("ii", size=22, align="right", before=0, after=120)
    b.p("KATA PENGANTAR", bold=True, size=28, align="center", before=120, after=240)
    
    b.p("Puji syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat, taufik, dan karunia-Nya, sehingga penulis dapat menyelesaikan laporan yang berjudul \"Pengembangan Website PC Builder 101 sebagai Media Pembelajaran Multimedia Interaktif 3D Pengenalan dan Perakitan Hardware Komputer\" ini dengan baik dan tepat waktu. Laporan ini disusun sebagai bentuk pertanggungjawaban akademis atas proyek pengembangan website media pembelajaran multimedia yang dikerjakan guna memenuhi Ujian Tengah Semester (UTS) pada mata kuliah Sistem Multimedia.", indent=720)
    
    b.p("Laporan ini membahas secara komprehensif proses perancangan dan perekayasaan website PC Builder 101, yaitu media pembelajaran digital berbasis web yang dirancang khusus untuk memfasilitasi mahasiswa maupun siswa dalam memahami arsitektur, fungsi, spesifikasi, dan prosedur pemasangan komponen fisik perangkat keras komputer secara aman melalui visualisasi 3D real-time WebGL (Three.js). Pembahasan di dalam dokumen ini mencakup landasan teori multimedia, metodologi pengembangan Multimedia Development Life Cycle (MDLC) yang mencakup 6 tahap, implementasi 5 unsur multimedia (teks, grafis 3D, audio, video tutorial, serta animasi), hingga analisis hasil pengujian fungsionalitas dan antarmuka sistem.", indent=720)
    
    b.p("Penulis menyampaikan rasa terima kasih dan apresiasi yang setinggi-tingginya kepada Ibu Melati Rosanensi, M.Kom., selaku dosen pengampu mata kuliah Sistem Multimedia, atas segala bimbingan, arahan akademis, dan masukan berharga yang diberikan selama proses pengerjaan proyek dan penyusunan laporan ini. Ucapan terima kasih juga penulis haturkan kepada keluarga dan rekan-rekan mahasiswa yang telah memberikan dukungan moral, kerja sama tim, dan motivasi berkesinambungan sehingga proyek ini dapat terwujud secara optimal.", indent=720)
    
    b.p("Penulis menyadari sepenuhnya bahwa laporan dan aplikasi website yang dikembangkan ini masih memiliki ruang untuk perbaikan dan penyempurnaan lebih lanjut. Oleh karena itu, penulis sangat mengharapkan saran, tanggapan, dan kritik yang membangun demi kemajuan di masa mendatang. Semoga laporan ini dapat memberikan manfaat nyata, memperluas wawasan keilmuan, serta menjadi referensi bermanfaat bagi pengembangan media pembelajaran multimedia interaktif di lingkungan perguruan tinggi.", indent=720)
    
    b.p("Mataram, 19 November 2026", align="right", before=240, after=40)
    b.p("Tim Penulis", align="right", before=0, after=120)
    
    b.page_break()
    
    # ==========================================
    # DAFTAR ISI (iii)
    # ==========================================
    b.p("iii", size=22, align="right", before=0, after=120)
    b.p("DAFTAR ISI", bold=True, size=28, align="center", before=120, after=240)
    
    toc_items = [
        ("KATA PENGANTAR", "ii"),
        ("DAFTAR ISI", "iii"),
        ("DAFTAR TABEL", "v"),
        ("DAFTAR GAMBAR", "vi"),
        ("BAB I PENDAHULUAN", "1"),
        ("  1.1 Latar Belakang", "1"),
        ("  1.2 Rumusan Masalah", "3"),
        ("  1.3 Tujuan Pengembangan", "3"),
        ("  1.4 Manfaat Pengembangan", "4"),
        ("  1.5 Batasan Masalah", "4"),
        ("BAB II PEMBAHASAN", "6"),
        ("  2.1 Multimedia", "6"),
        ("  2.2 Media Pembelajaran", "7"),
        ("  2.3 Website", "7"),
        ("  2.4 Teknologi Pengembangan Website", "8"),
        ("    2.4.1 HTML5 (HyperText Markup Language)", "8"),
        ("    2.4.2 CSS3 (Cascading Style Sheets) & Responsive Design", "9"),
        ("    2.4.3 JavaScript (ES6+)", "9"),
        ("    2.4.4 WebGL dan Three.js (3D Graphics Rendering Engine)", "10"),
        ("    2.4.5 Web Audio API & Audio Synthesizer", "10"),
        ("  2.5 Unsur Multimedia dalam Pembelajaran", "11"),
        ("    2.5.1 Teks", "11"),
        ("    2.5.2 Gambar dan Model Grafis 3D", "12"),
        ("    2.5.3 Audio (Voice-Over & BIOS Beep Codes)", "12"),
        ("    2.5.4 Video (Video Praktik Perakitan HD)", "13"),
        ("    2.5.5 Animasi (Exploded View, Fan Rotation, Assembly)", "13"),
        ("  2.6 Multimedia Interaktif", "14"),
        ("  2.7 Fitur Pendukung Pembelajaran PC Builder 101", "15"),
        ("    2.7.1 Eksplorasi Hardware 3D Interaktif", "15"),
        ("    2.7.2 Mode Bedah Komponen (Exploded View)", "15"),
        ("    2.7.3 Simulasi Perakitan Komputer (PC Assembly Simulator)", "16"),
        ("    2.7.4 Kalkulator Kebutuhan Daya (PSU Calculator)", "16"),
        ("    2.7.5 Modul Video Tutorial Praktik Perakitan", "17"),
        ("    2.7.6 Simulator Suara Diagnosa BIOS (Beep Codes & Oscilloscope)", "17"),
        ("    2.7.7 Kuis Evaluasi Pemahaman Interaktif", "18"),
        ("    2.7.8 Komparasi Form Factor Motherboard", "18"),
        ("  2.8 User Interface (UI) dan User Experience (UX)", "19"),
        ("  2.9 Pengujian Website", "20"),
        ("BAB III METODE PENGEMBANGAN", "21"),
        ("  3.1 Metode Pengembangan (MDLC)", "21"),
        ("  3.2 Tahapan Pengembangan", "21"),
        ("    3.2.1 Concept (Konsep)", "22"),
        ("    3.2.2 Design (Perancangan)", "22"),
        ("    3.2.3 Material Collecting (Pengumpulan Bahan)", "23"),
        ("    3.2.4 Assembly (Pembuatan)", "23"),
        ("    3.2.5 Testing (Pengujian)", "24"),
        ("    3.2.6 Distribution (Distribusi)", "24"),
        ("  3.3 Perangkat yang Digunakan", "25"),
        ("    3.3.1 Perangkat Keras", "25"),
        ("    3.3.2 Perangkat Lunak", "25"),
        ("  3.4 Perancangan Website", "26"),
        ("    3.4.1 Struktur Navigasi", "26"),
        ("    3.4.2 Perancangan Antarmuka", "27"),
        ("  3.5 Implementasi Website dan Multimedia", "29"),
        ("    3.5.1 Implementasi Halaman Utama dan Viewport 3D", "29"),
        ("    3.5.2 Implementasi Fitur Eksplorasi Hardware dan Mode Bedah", "30"),
        ("    3.5.3 Implementasi Unsur Multimedia", "31"),
        ("    3.5.4 Implementasi Simulasi Perakitan Komputer 3D", "32"),
        ("    3.5.5 Implementasi Modul Video Tutorial dan Animasi 2D", "33"),
        ("    3.5.6 Implementasi Simulator Audio BIOS Beep Code & Oscilloscope", "33"),
        ("    3.5.7 Implementasi Kuis Evaluasi dan Kalkulator PSU", "34"),
        ("  3.6 Pengujian Website", "35"),
        ("BAB IV HASIL DAN PEMBAHASAN", "36"),
        ("  4.1 Gambaran Umum Hasil Pengembangan", "36"),
        ("    4.1.1 Struktur dan Modul Website", "36"),
        ("    4.1.2 Teknologi yang Digunakan dalam Implementasi", "37"),
        ("  4.2 Hasil Implementasi Website", "38"),
        ("    4.2.1 Tampilan Beranda dan Viewport 3D", "38"),
        ("    4.2.2 Eksplorasi Hardware dan Exploded View", "39"),
        ("    4.2.3 Implementasi Unsur Multimedia", "40"),
        ("    4.2.4 Simulasi Perakitan PC 3D", "41"),
        ("    4.2.5 Modul Video Perakitan & Simulasi 2D", "42"),
        ("    4.2.6 Simulator Audio BIOS & Oscilloscope", "43"),
        ("    4.2.7 Kuis Evaluasi dan Fitur Pendukung Lainnya", "44"),
        ("  4.3 Hasil Pengujian Website", "45"),
        ("    4.3.1 Metode dan Aspek Pengujian", "45"),
        ("    4.3.2 Hasil Pengujian (Tabel 4.1)", "45"),
        ("    4.3.3 Analisis Hasil Pengujian", "47"),
        ("  4.4 Pembahasan", "48"),
        ("    4.4.1 Pembahasan Rumusan Masalah Pertama", "48"),
        ("    4.4.2 Pembahasan Rumusan Masalah Kedua", "49"),
        ("    4.4.3 Pembahasan Rumusan Masalah Ketiga", "50"),
        ("    4.4.4 Pembahasan Rumusan Masalah Keempat", "51"),
        ("    4.4.5 Pembahasan Kesesuaian dengan Tujuan dan Batasan Masalah", "52"),
        ("    4.4.6 Pembahasan dari Sudut Pandang UI dan UX", "53"),
        ("BAB V PENUTUP", "54"),
        ("  5.1 Kesimpulan", "54"),
        ("  5.2 Saran", "55"),
        ("DAFTAR PUSTAKA", "57")
    ]
    
    for left, right in toc_items:
        is_bold = left.startswith("BAB") or left in ["KATA PENGANTAR", "DAFTAR ISI", "DAFTAR TABEL", "DAFTAR GAMBAR", "DAFTAR PUSTAKA"]
        b.p_leader(left, right, bold=is_bold)
        
    b.page_break()
    
    # ==========================================
    # DAFTAR TABEL (v)
    # ==========================================
    b.p("v", size=22, align="right", before=0, after=120)
    b.p("DAFTAR TABEL", bold=True, size=28, align="center", before=120, after=240)
    b.p_leader("Tabel 2. 1 Integrasi 5 Unsur Multimedia di Dalam PC Builder 101", "14")
    b.p_leader("Tabel 3. 1 Daftar Kebutuhan Perangkat Lunak dan Pustaka", "25")
    b.p_leader("Tabel 4. 1 Hasil Pengujian Black-Box Website PC Builder 101", "46")
    b.p_leader("Tabel 4. 2 Evaluasi Kesesuaian Hasil Pengembangan dengan Batasan Masalah", "52")
    
    b.page_break()
    
    # ==========================================
    # DAFTAR GAMBAR (vi)
    # ==========================================
    b.p("vi", size=22, align="right", before=0, after=120)
    b.p("DAFTAR GAMBAR", bold=True, size=28, align="center", before=120, after=240)
    b.p_leader("Gambar 3. 1 Diagram Tahapan Multimedia Development Life Cycle (MDLC)", "22")
    b.p_leader("Gambar 3. 2 Struktur Navigasi Campuran (Composite) Website PC Builder 101", "26")
    b.p_leader("Gambar 3. 3 Wireframe HUD & Ruang Interaksi 3D Three.js", "27")
    b.p_leader("Gambar 3. 4 Rancangan Tampilan Eksplorasi 8 Komponen Hardware", "28")
    b.p_leader("Gambar 3. 5 Rancangan Tampilan Simulasi Perakitan PC 7 Tahap", "28")
    b.p_leader("Gambar 3. 6 Implementasi Tampilan Viewport 3D & Beranda Interaktif", "38")
    b.p_leader("Gambar 3. 7 Implementasi Fitur Mode Bedah (Exploded View)", "39")
    b.p_leader("Gambar 3. 8 Implementasi Tekstur Sirkuit Procedural Canvas pada Motherboard", "40")
    b.p_leader("Gambar 3. 9 Implementasi Simulasi Perakitan Komputer Interaktif", "41")
    b.p_leader("Gambar 3. 10 Implementasi Modul Video Tutorial Praktik MP4 HD", "42")
    b.p_leader("Gambar 3. 11 Implementasi Simulator Suara Diagnosa BIOS dan Real-Time Oscilloscope", "43")
    b.p_leader("Gambar 3. 12 Implementasi Kuis Evaluasi Pemahaman dan Kalkulator Daya PSU", "44")
    
    b.page_break()
    
    # ==========================================
    # BAB I PENDAHULUAN
    # ==========================================
    b.h1_chapter("I", "PENDAHULUAN")
    
    b.h2("1.1 Latar Belakang")
    b.p("Perkembangan pesat teknologi informasi dan komputasi di era modern telah mentransformasi berbagai lini kehidupan, terutama dalam bidang pendidikan teknik komputer dan teknologi informasi. Penguasaan terhadap perangkat keras komputer (computer hardware) dan kemahiran dalam merakit komputer (PC assembly) menjadi fondasi kompetensi yang sangat esensial bagi mahasiswa ilmu komputer, rekayasa perangkat lunak, maupun siswa sekolah kejuruan teknik komputer dan jaringan (TKJ). Pemahaman yang mendalam mengenai letak fisik soket, jenis antarmuka slot ekspansi, sirkulasi termal, serta kompatibilitas daya antar-komponen menentukan keberhasilan perakitan sebuah sistem komputer yang andal dan optimal.", indent=720)
    
    b.p("Namun dalam implementasi pembelajaran praktikum perakitan komputer konvensional, terdapat beberapa kendala mendasar yang kerap dihadapi peserta didik maupun institusi pendidikan, antara lain:", indent=720)
    b.p("1. Keterbatasan Aksesibilitas dan Biaya Hardware Fisik: Komponen perangkat keras modern (seperti prosesor soket LGA 1700/AM5, motherboard chipset Z790/B650, memori DDR5, SSD NVMe M.2, dan kartu grafis berdaya tinggi) memiliki nilai ekonomis yang sangat tinggi. Risiko kerusakan fisik akibat kesalahan penanganan pemula (seperti pin soket prosesor bengkok, pelepasan kait RAM yang dipaksakan, atau korsleting akibat listrik statis/ESD) membuat praktikum langsung di laboratorium sering kali dibatasi kuotanya.", indent=720)
    b.p("2. Keterbatasan Visualisasi Media 2D Statis: Buku teks, slide presentasi, atau diagram 2D konvensional tidak mampu memberikan gambaran spasial ruang tiga dimensi yang nyata. Pengguna kesulitan memvisualisasikan orientasi sudut pemasangan heatsink pendingin, peletakan SSD M.2 di balik heatsink pelindung termal, serta jalur sirkulasi udara casing.", indent=720)
    b.p("3. Kurangnya Literasi Diagnosa Suara (POST Beep Code): Pada saat komputer mengalami kegagalan proses booting awal (Power-On Self-Test / POST), motherboard memberikan sinyal audio berupa deretan bunyi beep. Banyak peserta didik kesulitan membedakan antara kode beep error memori RAM, kerusakan kartu grafis, maupun masalah pasokan daya tanpa alat peraga interaktif.", indent=720)
    b.p("4. Keharusan Pemasangan Perangkat Lunak Khusus: Banyak aplikasi simulasi 3D yang beredar saat ini mengharuskan pengunduhan dan instalasi aplikasi berkapasitas gigabyte yang membebani perangkat peserta didik dan sulit diakses secara instan.", indent=720)
    
    b.p("Berdasarkan permasalahan tersebut, dikembangkan sebuah inovasi media pembelajaran multimedia interaktif berbasis website bernama PC Builder 101. Aplikasi ini menghadirkan laboratorium virtual perakitan komputer 3D real-time yang dapat diakses langsung melalui peramban web (browser) tanpa instalasi aplikasi tambahan. Dibangun menggunakan teknologi WebGL dan Three.js, PC Builder 101 memodelkan 8 komponen utama komputer secara prosedural dengan material PBR (Physically Based Rendering) berkualitas tinggi, menyajikan fitur mode bedah (Exploded View), simulasi perakitan 7 langkah terstruktur, video tutorial HD per bab, sintesis suara diagnosa BIOS beep codes dengan osiloskop visual interaktif, kalkulator daya PSU, serta modul kuis evaluasi komprehensif.", indent=720)
    
    b.h2("1.2 Rumusan Masalah")
    b.p("Berdasarkan latar belakang yang telah dipaparkan, rumusan masalah dalam pengembangan website PC Builder 101 dirumuskan sebagai berikut:", indent=720)
    b.p("1. Bagaimana merancang dan mengembangkan PC Builder 101 sebagai media pembelajaran multimedia interaktif berbasis website menggunakan Three.js dan WebGL?", indent=720)
    b.p("2. Bagaimana mengintegrasikan 5 unsur multimedia secara utuh (teks, grafis 3D, audio narasi/synthesizer, video tutorial praktik, dan animasi interaktif) ke dalam platform PC Builder 101?", indent=720)
    b.p("3. Bagaimana menerapkan fitur interaktif berupa inspeksi 3D 360°, mode bedah (exploded view), simulasi perakitan komputer 7 tahap, simulator kode beep BIOS dengan visualisasi gelombang frekuensi, dan kuis evaluasi pemahaman?", indent=720)
    b.p("4. Bagaimana menyediakan kalkulator kebutuhan daya PSU dan komparasi form factor motherboard untuk mendukung pemahaman teknis pengguna secara mandiri?", indent=720)
    
    b.h2("1.3 Tujuan Pengembangan")
    b.p("Tujuan yang hendak dicapai melalui perancangan dan implementasi proyek ini adalah sebagai berikut:", indent=720)
    b.p("1. Mengembangkan media pembelajaran perakitan komputer interaktif berbasis website yang fleksibel, responsif, dan dapat diakses bebas tanpa instalasi software khusus.", indent=720)
    b.p("2. Mengintegrasikan secara harmonis lima unsur multimedia (teks materi, model grafis 3D real-time, audio voice-over dan efek suara, video tutorial praktik resolusi HD, serta animasi interaktif) untuk memfasilitasi berbagai modalitas gaya belajar.", indent=720)
    b.p("3. Menyediakan laboratorium virtual 3D yang memungkinkan pengguna memutar sudut pandang bebas (OrbitControls), membedah struktur internal komponen, dan menyimulasikan urutan pemasangan perangkat keras PC secara realistis dan bebas risiko.", indent=720)
    b.p("4. Mengimplementasikan simulator audio BIOS Beep Code berbasis Web Audio API synthesizer dengan visualisasi osiloskop real-time sebagai media edukasi diagnosa kerusakan perangkat keras.", indent=720)
    b.p("5. Menyediakan fitur evaluasi pemahaman berupa kuis multimedia interaktif dan alat bantu teknis berupa kalkulator estimasi kebutuhan daya Power Supply (PSU).", indent=720)
    
    b.h2("1.4 Manfaat Pengembangan")
    b.p("Pengembangan media pembelajaran PC Builder 101 ini diharapkan mampu memberikan kontribusi dan manfaat nyata bagi berbagai pihak:", indent=720)
    b.p("1. Bagi Mahasiswa dan Siswa (Peserta Didik): Memperoleh lingkungan belajar virtual yang aman, menarik, dan interaktif untuk mempelajari arsitektur hardware dan urutan perakitan PC tanpa rasa cemas merusakkan komponen berharga mahal.", indent=720)
    b.p("2. Bagi Pengajar dan Dosen: Menjadi media peraga instruksional digital yang dapat diproyeksikan di ruang kelas maupun dibagikan sebagai bahan penugasan praktikum mandiri bagi peserta didik.", indent=720)
    b.p("3. Bagi Pengembang: Mengasah kompetensi dan pengalaman rekayasa perangkat lunak dalam bidang grafika komputer WebGL/Three.js, sintesis audio web, optimasi performa render real-time, dan desain antarmuka modern berstandar industri.", indent=720)
    b.p("4. Bagi Pengembangan Media Pembelajaran: Memberikan tolok ukur implementasi multimedia mutakhir bahwa website modern sanggup menggabungkan simulasi 3D real-time, sintesis audio dinamis, dan video edukatif dalam satu ekosistem terpadu.", indent=720)
    
    b.h2("1.5 Batasan Masalah")
    b.p("Agar ruang lingkup pembahasan dan perekayasaan proyek tetap fokus, terarah, dan sesuai dengan target luaran UTS Sistem Multimedia, batasan masalah ditetapkan sebagai berikut:", indent=720)
    b.p("1. Produk multimedia yang dikembangkan berupa aplikasi web interaktif bernama PC Builder 101 yang dapat diakses secara daring melalui peramban web modern.", indent=720)
    b.p("2. Fokus materi pembelajaran mencakup 8 komponen vital perangkat keras komputer: Motherboard (MSI MPG Z790 Carbon WiFi), Central Processing Unit (CPU), Pendingin Prosesor (Liquid Cooler AIO), Memori RAM DDR5, Media Penyimpanan SSD NVMe M.2, Kartu Grafis (GPU RTX), Unit Catu Daya (PSU ATX), dan Casing Komputer (PC Chassis).", indent=720)
    b.p("3. Seluruh aset grafis 3D dibangun dan dirender secara prosedural menggunakan pustaka Three.js (WebGL) berbasis primitif geometri, PBR materials, dan kanvas tekstur sirkuit PCB 2D prosedural, sehingga tidak membutuhkan pemuatan model 3D biner eksternal berukuran berat.", indent=720)
    b.p("4. Unsur multimedia mencakup: teks deskripsi & spesifikasi, model 3D & grafis vektor SVG, audio suara narasi bahasa Indonesia & simulator beep BIOS, video tutorial praktik perakitan HD 720p, serta animasi transisi kamera dan perakitan.", indent=720)
    b.p("5. Simulasi perakitan PC 3D dibatasi pada 7 tahapan esensial: pemasangan CPU, penguncian RAM DDR5, pemasangan SSD M.2, penempelan Motherboard ke Casing, penguncian Heatsink Cooler, pemasangan PSU, hingga pemasangan GPU.", indent=720)
    b.p("6. Modul video tutorial menyajikan materi praktik perakitan 4 bab (CPU/Mobo, Thermal/Cooler, RAM/SSD, GPU/PSU/First Boot) yang dilengkapi alternatif simulasi gerak kanvas 2D.", indent=720)
    b.p("7. Distribusi aplikasi dilakukan melalui platform cloud deployment Vercel dan GitHub Pages.", indent=720)
    
    b.page_break()
    
    # ==========================================
    # BAB II PEMBAHASAN
    # ==========================================
    b.h1_chapter("II", "PEMBAHASAN")
    
    b.h2("2.1 Multimedia")
    b.p("Secara etimologis, istilah multimedia berakar dari kata multus yang bermakna banyak atau bermacam-macam, dan medium yang bermakna alat atau perantara untuk mengomunikasikan sesuatu. Dalam ilmu komputasi, multimedia didefinisikan sebagai integrasi terencana dari berbagai media penyampai informasi—yang mencakup teks, citra diam (gambar), audio, video, dan animasi—yang dikendalikan, dimanipulasi, dan disajikan melalui sistem komputer digital.", indent=720)
    
    b.p("Salah satu teori landasan paling berpengaruh dalam pemanfaatan multimedia untuk edukasi adalah Teori Kognitif Pembelajaran Multimedia (Cognitive Theory of Multimedia Learning) yang dipopulerkan oleh Richard E. Mayer (2021). Mayer menegaskan bahwa proses belajar manusia berlangsung jauh lebih efektif apabila informasi disajikan melalui kombinasi kata-kata (verbal/teks/audio) dan gambar (visual/grafis/3D) daripada hanya mengandalkan kata-kata tertulis semata. Prinsip ini berakar pada model memori kerja saluran ganda (dual-channel processing), di mana saluran visual (mata) dan saluran pendengaran (telinga) bekerja secara simultan memproses informasi tanpa saling membebani secara berlebihan jika didesain secara proporsional.", indent=720)
    
    b.h2("2.2 Media Pembelajaran")
    b.p("Media pembelajaran merupakan segala bentuk wahana, saluran fisik, atau peranti lunak yang digunakan pendidik untuk menyalurkan pesan dan materi pengajaran sehingga dapat merangsang atensi, minat, pikiran, dan perasaan peserta didik dalam kegiatan belajar. Dalam konteks ilmu komputer, media pembelajaran berfungsi sebagai jembatan yang mentransformasikan konsep-konsep abstrak atau fisik yang rumit menjadi visualisasi yang konkret dan mudah dipahami.", indent=720)
    
    b.p("Pemanfaatan media pembelajaran interaktif berbasis simulasi digital (virtual laboratory) memberikan keunggulan pedagogis yang signifikan. Peserta didik dapat bereksperimen, melakukan kesalahan berulang kali secara aman tanpa menimbulkan kerugian material, serta memperoleh umpan balik (feedback) seketika dari sistem.", indent=720)
    
    b.h2("2.3 Website sebagai Platform Distribusi Multimedia")
    b.p("Website merupakan sekumpulan dokumen digital berbasis hypermedia yang saling bertautan dan dapat diakses secara global melalui jaringan internet menggunakan protokol HTTP/HTTPS serta peramban web (web browser). Sebagai platform distribusi media pembelajaran, website memiliki sederet keunggulan strategis:", indent=720)
    b.p("1. Aksesibilitas Universal (Cross-Platform): Dapat diakses dari berbagai sistem operasi (Windows, macOS, Linux, Android, iOS) tanpa perlu kompilasi ulang kode biner khusus perangkat.", indent=720)
    b.p("2. Zero-Installation: Pengguna tidak dipersyaratkan mengunduh paket instalasi biner (.exe/.apk) yang memakan kapasitas penyimpanan fisik perangkat keras.", indent=720)
    b.p("3. Kemudahan Pembaruan (Instant Updates): Perbaikan logika simulasi maupun pembaruan materi dapat dilakukan di sisi repositori/server dan langsung dinikmati pengguna saat memuat ulang halaman web.", indent=720)
    
    b.h2("2.4 Teknologi Pengembangan Website")
    b.p("Website PC Builder 101 dikembangkan menggunakan arsitektur web modern tanpa ketergantungan framework berat, memaksimalkan efisiensi eksekusi dan kecepatan render browser native:", indent=720)
    
    b.h3("2.4.1 HTML5 (HyperText Markup Language 5)")
    b.p("HTML5 merupakan standar markup generasi mutakhir yang menyusun struktur dasar semantik dokumen web. Pada PC Builder 101, HTML5 menyediakan elemen-elemen penting seperti kanvas grafika (<canvas>) untuk viewport 3D dan simulasi 2D, elemen pemutar media (<video> dan <audio>), serta elemen navigasi dan dialog modal struktural.", indent=720)
    
    b.h3("2.4.2 CSS3 (Cascading Style Sheets) & Responsive Layout")
    b.p("CSS3 digunakan untuk mengatur tata letak visual, tipografi, tema warna, dan adaptabilitas antarmuka. PC Builder 101 mengusung desain Cyber-Studio Glassmorphism, memanfaatkan properti backdrop-filter: blur(16px), gradien warna neon aksen sian (#00f0ff) dan ungu (#a855f7), serta media queries komprehensif untuk menjamin kenyamanan navigasi pada layar desktop monitor hingga layar sentuh ponsel pintar.", indent=720)
    
    b.h3("2.4.3 JavaScript (ES6+)")
    b.p("JavaScript bertindak sebagai motor penggerak seluruh logika interaksi aplikasi. Fitur modern seperti Class ES6, async/await, modul event handling, manipulasi DOM dinamis, kalkulasi konsumsi daya listrik, dan manajemen state simulasi rakit dikendalikan secara murni menggunakan JavaScript murni (Vanilla JS).", indent=720)
    
    b.h3("2.4.4 WebGL dan Three.js (3D Graphics Rendering Engine)")
    b.p("WebGL (Web Graphics Library) adalah API JavaScript berkecepatan tinggi yang memanfaatkan unit pemroses grafis perangkat keras (GPU) untuk me-render grafika 3D interaktif di dalam browser tanpa plugin tambahan. Three.js merupakan pustaka 3D tingkat tinggi yang membungkus kompleksitas WebGL menjadi antarmuka pemrograman yang terstruktur (Scene, PerspectiveCamera, WebGLRenderer, Mesh, Geometries, PBR Materials, DirectionalLight, ShadowMap, dan Raycaster). Melalui Three.js, PC Builder 101 sanggup menghadirkan pencahayaan fotorealistik dan interaksi raycasting presisi tinggi.", indent=720)
    
    b.h3("2.4.5 Web Audio API & Audio Synthesizer")
    b.p("Web Audio API adalah standar sistem pemrosesan audio tingkat lanjut di dalam browser web. Alih-alih hanya memutar file audio statis, Web Audio API memungkinkan aplikasi membangkitkan gelombang suara secara dinamis (Audio Synthesizer) menggunakan OscillatorNode, mengendalikan volume dengan GainNode, dan mengekstraksi data frekuensi gelombang secara real-time melalui AnalyserNode untuk ditampilkan pada kanvas osiloskop visual.", indent=720)
    
    b.h2("2.5 Unsur Multimedia dalam Pembelajaran")
    b.p("PC Builder 101 mengintegrasikan kelima unsur multimedia secara harmonis:", indent=720)
    b.p("1. Teks: Menyajikan uraian deskripsi fungsi, cara kerja, spesifikasi teknis, standar keselamatan kerja (K3), petunjuk perakitan bertahap, serta butir soal evaluasi kuis.", indent=720)
    b.p("2. Gambar dan Model 3D: Model 3D detail untuk 8 komponen PC yang dapat dirotasi 360°, diagram perbandingan dimensi form factor ATX, dan ikon grafis SVG penanda komponen.", indent=720)
    b.p("3. Audio: Berkas suara narasi (Voice-Over) bahasa Indonesia, efek suara klik antarmuka (SFX), musik latar elektronik (BGM ambient), serta nada kode beep error BIOS yang disintesis secara dinamis.", indent=720)
    b.p("4. Video: Modul video tutorial praktik resolusi HD (1280x720) 30fps dengan sulih suara bahasa Indonesia yang terbagi dalam 4 bab materi perakitan.", indent=720)
    b.p("5. Animasi: Gerakan transisi kamera (Camera Fly-To), animasi pelepasan komponen (Exploded View), putaran kipas pendingin, animasi transisi spektrum lampu ARGB, dan animasi penyisipan komponen ke dalam soket motherboard.", indent=720)
    
    b.h2("2.6 Multimedia Interaktif")
    b.p("Multimedia interaktif terjadi manakala pengguna diberikan kendali aktif untuk menentukan alur navigasi, memanipulasi objek visual, menginput parameter, dan menerima respons sistem secara instan dua arah. Pada PC Builder 101, interaktivitas dihadirkan melalui kontrol orbit kamera (mouse click-drag & touch rotate/pinch), penekanan tombol mode bedah, pemilihan langkah simulasi rakit yang memicu animasi pemasangan komponen, simulasi tombol uji kode beep, dan kalkulator interaktif konsumsi watt PSU.", indent=720)
    
    b.h2("2.7 Fitur Pendukung Pembelajaran PC Builder 101")
    b.p("Fitur-fitur unggulan yang disediakan di dalam aplikasi mencakup:", indent=720)
    b.p("1. Eksplorasi Komponen Hardware 3D: Ruang inspeksi 8 komponen komputer dengan hotspot 3D interaktif yang menempel pada koordinat komponen.", indent=720)
    b.p("2. Mode Bedah (Exploded View): Fitur pembongkaran visual di mana seluruh komponen PC bergerak memisah secara halus dari rangka casing untuk memperlihatkan arsitektur interior.", indent=720)
    b.p("3. Simulasi Perakitan Komputer (PC Assembly Simulator): Panduan 7 tahap perakitan langkah-demi-langkah dengan validasi keberhasilan dan sulih suara pendamping.", indent=720)
    b.p("4. Kalkulator Kebutuhan Daya (PSU Calculator): Alat bantu hitung konsumsi daya listrik komponen secara real-time dengan rekomendasi kapasitas watt PSU.", indent=720)
    b.p("5. Modul Video Tutorial Perakitan: Pemutar video interaktif bab per bab yang dilengkapi alternatif simulasi animasi grafis kanvas 2D.", indent=720)
    b.p("6. Simulator Kode Beep BIOS & Real-Time Oscilloscope: Simulator audio error hardware komputer yang disertai grafik visualisasi gelombang frekuensi suara.", indent=720)
    b.p("7. Kuis Evaluasi Pemahaman: Modul evaluasi 10 soal pilihan ganda dengan pembahasan langsung dan kalkulasi skor pemahaman.", indent=720)
    b.p("8. Komparasi Form Factor Motherboard: Modal dialog interaktif yang menyajikan tabel komparasi teknis dan visual form factor E-ATX, ATX, Micro-ATX, dan Mini-ITX.", indent=720)
    
    b.h2("2.8 User Interface (UI) dan User Experience (UX)")
    b.p("Perancangan UI/UX berpusat pada kenyamanan eksplorasi pengguna. Tata letak mengadopsi Non-Intrusive HUD Layout di mana ruang 3D memenuhi seluruh latar belakang layar, sementara panel kontrol transparan diletakkan di sisi layar agar tidak menghalangi objek pengamatan 3D. Pada perangkat ponsel pintar (mobile), antarmuka secara adaptif bertransformasi menjadi navigasi bilah bawah (bottom navigation bar) yang mudah dijangkau dengan ibu jari satu tangan.", indent=720)
    
    b.h2("2.9 Pengujian Website")
    b.p("Pengujian perangkat lunak dilakukan menggunakan metode Black-Box Testing, yaitu pengujian yang berfokus pada spesifikasi fungsional antarmuka, input-output, responsivitas elemen kontrol, dan pemutaran multimedia tanpa harus memeriksa struktur internal kode pemrograman per baris.", indent=720)
    
    b.page_break()
    
    # ==========================================
    # BAB III METODE PENGEMBANGAN
    # ==========================================
    b.h1_chapter("III", "METODE PENGEMBANGAN")
    
    b.h2("3.1 Metode Pengembangan Multimedia Development Life Cycle (MDLC)")
    b.p("Metode pengembangan sistem yang diterapkan dalam proyek PC Builder 101 adalah Multimedia Development Life Cycle (MDLC) versi Luther yang disempurnakan oleh Sutopo. Metode MDLC sangat ideal untuk pengembangan aplikasi multimedia karena menyediakan alur kerja yang sistematis, terstruktur, dan terukur mulai dari perumusan ide awal hingga tahap distribusi produk akhir kepada pengguna luas.", indent=720)
    
    b.h2("3.2 Tahapan Pengembangan")
    b.p("Metode MDLC terdiri atas enam tahapan berurutan:", indent=720)
    
    b.h3("3.2.1 Concept (Konsep)")
    b.p("Tahap perumusan konsep menetapkan identitas produk, tujuan edukasi, sasaran audiens (mahasiswa IT dan siswa SMK), serta arsitektur antarmuka. Diputuskan bahwa produk akan berwujud platform virtual lab 3D berbasis web browser dengan tema perangkat keras komputer, mengedepankan efisiensi memori dengan memanfaatkan teknik pemodelan prosedural Three.js tanpa membebani jaringan pengguna.", indent=720)
    
    b.h3("3.2.2 Design (Perancangan)")
    b.p("Tahap perancangan mematangkan arsitektur sistem, meliputi pembuatan struktur navigasi campuran (composite), rancangan wireframe antarmuka HUD Glassmorphism, skenario interaksi 3D (camera orbit, click-to-focus, exploded view), serta naskah storyboard untuk video tutorial dan materi suara voice-over.", indent=720)
    
    b.h3("3.2.3 Material Collecting (Pengumpulan Bahan)")
    b.p("Tahap pengumpulan bahan mencakup penyusunan materi teks hardware yang valid, perekaman suara narasi bahasa Indonesia berkualitas tinggi berformat MP3, pembuatan aset video tutorial perakitan fisik PC dalam format MP4 HD (1280x720), pengumpulan frekuensi standar kode beep BIOS, serta penyusunan algoritma kalkulasi daya PSU dan butir soal kuis evaluasi.", indent=720)
    
    b.h3("3.2.4 Assembly (Pembuatan)")
    b.p("Tahap pembuatan merupakan tahap utama pengintegrasian seluruh komponen menjadi aplikasi web fungsional: membangun ruang 3D Three.js di file scene3d.js (pembentukan mesh Motherboard, CPU, Cooler, RAM, SSD, GPU, PSU, Casing beserta tekstur kanvas sirkuit dinamis), mengembangkan sistem kontrol suara Web Audio API di audio-engine.js, merangkai logika navigasi dan perakitan di app.js, serta menyusun styling CSS modern di style.css.", indent=720)
    
    b.h3("3.2.5 Testing (Pengujian)")
    b.p("Tahap pengujian dilakukan untuk memastikan seluruh fungsionalitas tombol, transisi 3D, pemutaran audio, video playback, perhitungan kalkulator daya, dan modul kuis bekerja tanpa celah kesalahan. Pengujian dilakukan melalui metode Black-Box testing di berbagai peramban web modern (Google Chrome, Microsoft Edge, Mozilla Firefox) pada desktop maupun perangkat seluler pintar.", indent=720)
    
    b.h3("3.2.6 Distribution (Distribusi)")
    b.p("Tahap akhir adalah peluncuran dan distribusi aplikasi secara online agar dapat diakses oleh publik luas tanpa batasan waktu dan tempat. Proyek dipublikasikan secara daring melalui infrastruktur cloud Vercel pada URL https://pcbuilder-opal.vercel.app dan repositori kode terbuka GitHub pada https://github.com/Fanndev/3D-PC-Builder.", indent=720)
    
    b.h2("3.3 Perangkat yang Digunakan")
    b.h3("3.3.1 Perangkat Keras (Hardware)")
    b.p("Pengembangan dilakukan menggunakan perangkat komputer dengan spesifikasi:", indent=720)
    b.p("1. Prosesor: AMD Ryzen 5 / Intel Core i5 Multi-core berkecepatan 3.50 GHz", indent=720)
    b.p("2. Memori RAM: 16 GB DDR4 Dual-Channel High-Speed", indent=720)
    b.p("3. Kartu Grafis: Dedicated GPU NVIDIA GeForce RTX series yang mendukung akselerasi WebGL 2.0", indent=720)
    b.p("4. Media Penyimpanan: SSD NVMe 512 GB", indent=720)
    b.p("5. Perangkat Uji Tambahan: Smartphone Android layar sentuh untuk validasi responsive touch controls", indent=720)
    
    b.h3("3.3.2 Perangkat Lunak (Software)")
    b.p("Perangkat lunak pendukung pengembangan mencakup:", indent=720)
    b.p("1. Visual Studio Code (VS Code): Lingkungan pengkodean utama untuk HTML5, CSS3, dan JavaScript", indent=720)
    b.p("2. Three.js Library (r128): Pustaka grafika WebGL 3D JavaScript", indent=720)
    b.p("3. Web Audio API & FFmpeg: Pengolahan dan pengodean audio MP3 serta video MP4 HD", indent=720)
    b.p("4. Web Browser (Google Chrome, Microsoft Edge): Peramban web untuk debugging, pengujian performa canvas 60 FPS, dan inspeksi WebGL context", indent=720)
    b.p("5. Git & GitHub: Sistem kontrol versi kode sumber", indent=720)
    b.p("6. Vercel Cloud Platform: Server hosting dan distribusi aplikasi berbasis CDN global", indent=720)
    
    b.h2("3.4 Perancangan Website")
    b.h3("3.4.1 Struktur Navigasi")
    b.p("Website PC Builder 101 menerapkan struktur navigasi campuran (composite/non-linear navigation). Pengguna dapat langsung melompat ke modul mana pun melalui bilah navigasi pulau melayang (floating island navigation bar):", indent=720)
    b.p("- Halaman Beranda (Hero Banner & Sambutan Audio Narasi)", indent=720)
    b.p("- Modul Eksplorasi 3D (Inspeksi 8 Komponen, Mode Bedah, Hotspot 3D, Tab Spesifikasi & K3)", indent=720)
    b.p("- Modul Simulasi Perakitan 3D (Panduan 7 Langkah, Validasi Perakitan, Kalkulator Daya PSU)", indent=720)
    b.p("- Modul Video Tutorial & Audio BIOS (Pemutar Video MP4 HD, Simulasi 2D, Simulator Beep Codes & Oscilloscope)", indent=720)
    b.p("- Modul Kuis Evaluasi (10 Soal Pilihan Ganda, Umpan Balik Skor & Penjelasan)", indent=720)
    
    b.h3("3.4.2 Perancangan Antarmuka")
    b.p("Antarmuka dirancang menggunakan konsep Glassmorphism Futuristik dengan kontras tinggi. Elemen UI tidak menutupi kanvas 3D Three.js melainkan mengapung secara transparan di atas ruang simulasi, memberikan sensasi berada di dalam laboratorium perakitan masa depan.", indent=720)
    
    b.h2("3.5 Implementasi Website dan Multimedia")
    b.p("Pada tahap perakitan teknis, seluruh logika Three.js disusun secara prosedural di file scene3d.js. Setiap komponen PC dibentuk melalui geometri primitif yang dikombinasikan dengan matriks transformasi (Group). PBR materials diaplikasikan dengan parameter metalness (0.85 untuk heatsink aluminium dan bracket baja) serta roughness (0.2 untuk permukaan kaca tempered casing). Tekstur jalur sirkuit listrik motherboard digambar secara dinamis ke dalam elemen HTML5 Canvas berketinggian 1024x1024 piksel dengan garis tembaga emas dan solder pads perak, kemudian dikonversikan menjadi CanvasTexture Three.js.", indent=720)
    
    b.p("Audio narasi bahasa Indonesia dimuat dan dikendalikan melalui AudioEngine.js yang memiliki manajemen mute/unmute independen antara musik latar (BGM), efek suara interaksi (SFX), dan voice-over instruksional. Generator Beep Code memanfaatkan OscillatorNode bertipe sinyal gelombang sinus/kotak (square wave) yang frekuensinya dianalisis secara real-time oleh AnalyserNode dan dirender ke kanvas osiloskop visual.", indent=720)
    
    b.h2("3.6 Pengujian Website")
    b.p("Pengujian dilakukan untuk memverifikasi fungsionalitas sistem pada aspek rendering 3D, animasi mode bedah, navigasi antar-modul, responsivitas kontrol sentuh mobile, sintesis suara beep, hingga validasi penilaian kuis.", indent=720)
    
    b.page_break()
    
    # ==========================================
    # BAB IV HASIL DAN PEMBAHASAN
    # ==========================================
    b.h1_chapter("IV", "HASIL DAN PEMBAHASAN")
    
    b.h2("4.1 Gambaran Umum Hasil Pengembangan")
    b.p("Pengembangan media pembelajaran multimedia interaktif PC Builder 101 telah berhasil diselesaikan dengan baik melalui penerapan enam tahapan metodologi MDLC (Concept, Design, Material Collecting, Assembly, Testing, dan Distribution). Hasil akhir proyek adalah sebuah aplikasi laboratorium virtual 3D perakitan komputer berbasis website yang terdistribusi secara publik di alamat https://pcbuilder-opal.vercel.app.", indent=720)
    
    b.p("PC Builder 101 berhasil menyatukan kelima elemen multimedia dan berbagai fitur interaktif ke dalam satu antarmuka yang kohesif. Pengguna dapat membaca uraian teks teknis, mengamati model 3D komponen dari sudut mana pun, mendengarkan narasi suara instruksional, menyaksikan tayangan video tutorial perakitan fisik komputer, mengamati animasi perakitan bertahap, menyimulasikan kode suara error BIOS, mengukur pemahaman melalui kuis, serta menghitung kebutuhan daya listrik komputer secara mandiri.", indent=720)
    
    b.h2("4.2 Hasil Implementasi Website")
    b.h3("4.2.1 Tampilan Beranda dan Viewport 3D")
    b.p("Saat pertama kali dibuka, pengguna disuguhi viewport 3D Three.js yang menampilkan rig komputer lengkap dengan panel kaca transparan dan kipas pendingin yang berputar dinamis dengan efek pencahayaan ARGB neon. Banner pengantar menyajikan tombol cepat Mulai Eksplorasi 3D dan Mulai Simulasi Rakit, disertai tombol pemutar suara sambutan selamat datang berformat audio narasi bahasa Indonesia.", indent=720)
    
    b.h3("4.2.2 Eksplorasi Hardware 3D dan Mode Bedah (Exploded View)")
    b.p("Modul Eksplorasi Hardware memungkinkan pengguna memilih salah satu dari 8 komponen PC melalui kartu navigasi sisi kiri. Kamera 3D akan secara halus bergerak terbang (smooth camera interpolation) menuju komponen yang dipilih. Tombol Mode Bedah (Exploded View) akan menggeser komponen-komponen komputer secara proporsional ke arah luar menjauhi rangka casing, memberikan pemahaman mendalam tentang lapisan interior motherboard dan slot perangkat keras yang sebelumnya tersembunyi.", indent=720)
    
    b.h3("4.2.3 Implementasi Unsur Multimedia")
    b.p("Implementasi 5 unsur multimedia di dalam PC Builder 101 berjalan secara harmonis:", indent=720)
    b.p("a. Teks: Disajikan secara terstruktur pada panel informasi (deskripsi, spesifikasi teknis, fungsi, dan tips keselamatan kerja K3 perakitan).", indent=720)
    b.p("b. Model Grafis 3D: Diprogram secara murni menggunakan Three.js WebGL (tanpa aset biner eksternal berat) dengan tekstur sirkuit PCB 1024x1024 procedural canvas, material logam, kaca tempered, dan slot tembaga.", indent=720)
    b.p("c. Audio: Menyediakan audio narasi voice-over bahasa Indonesia untuk tiap komponen dan langkah perakitan, musik latar santai (BGM ambient), efek suara klik (SFX), dan simulator kode beep error BIOS yang disintesis dinamis.", indent=720)
    b.p("d. Video: Menampilkan modul video praktik perakitan komputer beresolusi HD 720p yang terbagi atas 4 bab pembelajaran dengan narasi tersinkronisasi.", indent=720)
    b.p("e. Animasi: Putaran kipas pendingin kontinu, denyut lampu ARGB yang dapat diganti temanya, animasi buka-tutup kaca casing, transisi kamera orbit, dan animasi perakitan komponen ke soketnya.", indent=720)
    
    b.h3("4.2.4 Simulasi Perakitan Komputer (PC Assembly Simulator)")
    b.p("Fitur ini memandu pengguna merakit PC melalui 7 langkah berurutan (CPU -> RAM -> SSD -> Motherboard -> Cooler -> PSU -> GPU). Setiap langkah disertai checklist instruksi, audio narasi panduan, dan animasi visual komponen yang terpasang secara tepat pada dudukannya.", indent=720)
    
    b.h3("4.2.5 Modul Video Tutorial Perakitan & Simulasi 2D")
    b.p("Menyajikan pemutar video interaktif dengan 4 bab materi perakitan. Apabila pengguna berada pada koneksi lambat, tersedia tombol alternatif Simulasi 2D yang memutar animasi motion-graphic interaktif pada elemen HTML5 Canvas.", indent=720)
    
    b.h3("4.2.6 Simulator Audio BIOS Beep Code & Real-Time Oscilloscope")
    b.p("Menyediakan sarana diagnostik audio untuk mendengarkan pola beep error standar motherboard (Normal POST, RAM Error, VGA Error, Overheat CPU, Power Fault). Frekuensi audio yang disintesis oleh Web Audio API digambar secara real-time pada osiloskop visual berbentuk gelombang spektrum frekuensi hijau fosfor.", indent=720)
    
    b.h3("4.2.7 Kuis Evaluasi Pemahaman dan Kalkulator Daya PSU")
    b.p("Modul kuis menyajikan 10 butir pertanyaan multimedia seputar fungsi dan keselamatan perakitan hardware, memberikan umpan balik jawaban benar/salah serta pembahasan ilmiah. Di samping itu, kalkulator daya PSU memungkinkan pengguna menghitung estimasi konsumsi listrik (watt) dari kombinasi perangkat keras yang dipilih dan memberikan rekomendasi rating sertifikasi 80 Plus PSU.", indent=720)
    
    b.h2("4.3 Hasil Pengujian Website")
    b.h3("4.3.1 Metode dan Aspek Pengujian")
    b.p("Pengujian dilakukan menggunakan teknik Black-Box testing pada perangkat desktop (Google Chrome versi 124, resolusi 1920x1080) dan ponsel cerdas Android (Chrome Mobile, resolusi 1080x2400). Aspek yang diuji meliputi fungsi navigasi, interaksi 3D, pemutaran audio narasi, video player, sintesis kode beep, kalkulator daya, dan kuis evaluasi.", indent=720)
    
    b.h3("4.3.2 Hasil Pengujian Fungsionalitas")
    b.p("Rangkuman hasil pengujian 12 fitur utama disajikan pada Tabel 4.1 berikut:", indent=720)
    
    test_headers = ["No", "Fitur yang Diuji", "Hasil", "Keterangan Evaluasi"]
    test_rows = [
        ["1", "Navigasi Antar-Modul (Floating Island Bar)", "Berhasil", "Menu Beranda, Eksplorasi, Simulasi, Video, dan Kuis berpindah mulus tanpa reload halaman."],
        ["2", "Viewport 3D Three.js & OrbitControls", "Berhasil", "Model 3D rig komputer dapat diputar 360°, di-zoom in/out, dan di-pan dengan lancar (60 FPS)."],
        ["3", "Inspeksi 8 Komponen Hardware Komputer", "Berhasil", "Kamera otomatis bergerak halus (Camera Fly-To) menyorot komponen yang dipilih pada panel kiri."],
        ["4", "Mode Bedah Komponen (Exploded View)", "Berhasil", "Komponen-komponen terpisah secara proporsional dari casing dan kembali merapat saat dinonaktifkan."],
        ["5", "Simulasi Perakitan PC 3D (7 Tahapan)", "Berhasil", "Komponen terpasang satu per satu sesuai urutan instruksi disertai checklist dan audio narasi."],
        ["6", "Unsur Audio: Voice-Over & SFX", "Berhasil", "Audio narasi bahasa Indonesia dapat diputar dan dihentikan; efek klik tombol terdengar jernih."],
        ["7", "Unsur Video: Pemutar Video Praktik HD", "Berhasil", "Video tutorial MP4 720p dapat diputar lancar per bab materi maupun full video 4 bab sekaligus."],
        ["8", "Mode Alternatif Simulasi Animasi 2D", "Berhasil", "Animasi kanvas 2D bergerak dinamis menjelaskan tahapan perakitan sebagai alternatif video MP4."],
        ["9", "Simulator Kode Beep BIOS & Oscilloscope", "Berhasil", "Web Audio API membangkitkan pola beep error dan osiloskop menggambar grafik gelombang real-time."],
        ["10", "Kalkulator Kebutuhan Daya PSU", "Berhasil", "Kalkulasi watt total akurat dan memberikan rekomendasi kapasitas PSU minimum secara otomatis."],
        ["11", "Kuis Evaluasi Pemahaman Multimedia", "Berhasil", "10 butir pertanyaan berfungsi dengan baik, memberikan skor akhir dan pembahasan lengkap."],
        ["12", "Responsivitas Mobile & Touch Gestures", "Berhasil", "Antarmuka bertransformasi menjadi bottom navigation bar; multi-touch pinch/rotate berfungsi optimal."]
    ]
    b.table(test_headers, test_rows, [500, 2400, 1100, 4600])
    
    b.h3("4.3.3 Analisis Hasil Pengujian")
    b.p("Berdasarkan pengujian pada Tabel 4.1, seluruh fungsionalitas aplikasi PC Builder 101 berhasil beroperasi 100% sesuai dengan spesifikasi perancangan awal. Integrasi kelima elemen multimedia (teks, grafis 3D, audio, video, dan animasi) berjalan harmonis tanpa konflik memori atau perlambatan frame rate di browser. Responsivitas antarmuka pada ponsel pintar juga terbukti nyaman digunakan berkat penerapan layout bilah bawah dan kontrol sentuh terpadu.", indent=720)
    
    b.h2("4.4 Pembahasan")
    b.h3("4.4.1 Pembahasan Rumusan Masalah Pertama")
    b.p("Rumusan masalah pertama mengenai perancangan dan perekayasaan website media pembelajaran multimedia 3D berbasis Three.js terjawab secara tuntas melalui penerapan metodologi MDLC. Arsitektur Three.js yang disusun secara prosedural terbukti sangat efisien; pengguna dapat mengamati komponen hardware dalam resolusi tinggi tanpa harus menunggu pengunduhan berkas model 3D biner eksternal yang besar.", indent=720)
    
    b.h3("4.4.2 Pembahasan Rumusan Masalah Kedua")
    b.p("Rumusan masalah kedua mengenai integrasi 5 unsur multimedia terjawab dengan tersedianya teks penjelasan terstruktur, model 3D fotorealistik dengan tekstur PCB canvas, 31 berkas audio narasi dan synthesizer beep, 5 video tutorial perakitan fisik HD, serta animasi interaktif. Pembagian peran antar-media ini sejalan dengan teori Mayer (2021), di mana penyajian audio dan visual secara komplementer memperkuat retensi pemahaman pengguna.", indent=720)
    
    b.h3("4.4.3 Pembahasan Rumusan Masalah Ketiga")
    b.p("Rumusan masalah ketiga mengenai penerapan fitur-fitur interaktif terjawab dengan berhasil diterapkannya mode bedah (exploded view), simulasi perakitan PC 7 langkah, simulator audio diagnosa BIOS dengan visualisasi live oscilloscope, serta kuis evaluasi 10 soal dengan penjelasan jawaban instan. Pengguna tidak sekadar membaca materi secara pasif, melainkan terlibat langsung dalam kegiatan eksplorasi dan perakitan virtual.", indent=720)
    
    b.h3("4.4.4 Pembahasan Rumusan Masalah Keempat")
    b.p("Rumusan masalah keempat mengenai kalkulator kebutuhan daya PSU dan komparasi form factor motherboard terjawab melalui tersedianya fitur kalkulator interaktif yang secara otomatis menjumlahkan estimasi konsumsi watt prosesor, kartu grafis, memori, pendingin, dan kipas, lalu memberikan rekomendasi kapasitas PSU minimum serta modal perbandingan form factor yang memperjelas dimensi fisik standar ATX.", indent=720)
    
    b.h3("4.4.5 Pembahasan Kesesuaian dengan Tujuan dan Batasan Masalah")
    b.p("Seluruh luaran yang dicapai telah memenuhi kelima butir tujuan pengembangan yang ditetapkan pada Bab I dan konsisten mematuhi tujuh batasan masalah proyek tanpa deviasi negatif.", indent=720)
    
    b.h3("4.4.6 Pembahasan dari Sudut Pandang UI dan UX")
    b.p("Dari perspektif User Interface (UI), pemilihan palet warna gelap (Dark Cyber-Studio) dengan aksen neon sian dan ungu dipadukan efek kaca blur (glassmorphism) berhasil menciptakan identitas visual teknologi tinggi yang atraktif. Dari segi User Experience (UX), penempatan ruang 3D sebagai latar utama dan kontrol yang responsif memudahkan pengguna pemula maupun mahir mengoperasikan laboratorium virtual ini dengan intuitif.", indent=720)
    
    b.page_break()
    
    # ==========================================
    # BAB V PENUTUP
    # ==========================================
    b.h1_chapter("V", "PENUTUP")
    
    b.h2("5.1 Kesimpulan")
    b.p("Berdasarkan serangkaian proses perancangan, pembuatan, pengujian, dan pembahasan yang telah diuraikan pada bab-bab sebelumnya, dapat ditarik beberapa kesimpulan pokok sebagai berikut:", indent=720)
    b.p("1. Website PC Builder 101 berhasil dirancang dan dikembangkan sebagai media pembelajaran multimedia interaktif 3D pengenalan dan perakitan hardware komputer berbasis web yang inovatif dan mudah diakses tanpa memerlukan instalasi aplikasi khusus.", indent=720)
    b.p("2. Metode Multimedia Development Life Cycle (MDLC) dengan 6 tahapannya (Concept, Design, Material Collecting, Assembly, Testing, dan Distribution) berhasil memandu proses perekayasaan sistem secara terstruktur, terarah, dan terdokumentasi dengan baik.", indent=720)
    b.p("3. Kelima unsur multimedia—yaitu teks materi teknis, model grafis 3D prosedural Three.js, audio narasi voice-over bahasa Indonesia dan sintesis kode beep, video tutorial praktik perakitan HD 720p, serta animasi interaktif—berhasil diintegrasikan secara utuh dan harmonis sesuai dengan prinsip teori kognitif pembelajaran multimedia.", indent=720)
    b.p("4. Fitur-fitur interaktif unggulan seperti Eksplorasi 3D 360°, Mode Bedah (Exploded View), Simulasi Perakitan 7 Tahap, Modul Video Interaktif, Simulator Suara BIOS Beep Code dengan Live Oscilloscope, Kalkulator Daya PSU, dan Kuis Evaluasi Pemahaman berfungsi dengan sangat baik dan memperoleh tingkat keberhasilan 100% pada pengujian Black-Box.", indent=720)
    b.p("5. Aplikasi telah berhasil dipublikasikan secara daring melalui cloud platform Vercel pada tautan https://pcbuilder-opal.vercel.app dan kode sumber terbuka pada repositori GitHub https://github.com/Fanndev/3D-PC-Builder, sehingga siap dimanfaatkan secara luas oleh mahasiswa, siswa SMK, maupun masyarakat umum.", indent=720)
    
    b.h2("5.2 Saran")
    b.p("Demi pengembangan dan penyempurnaan media pembelajaran PC Builder 101 pada masa mendatang, diajukan beberapa saran konstruktif:", indent=720)
    b.p("1. Penambahan Variasi Komponen: Mengembangkan katalog komponen yang lebih luas, seperti variasi soket AMD AM5, sistem pendingin kustom liquid cooling (hard-tubing), dan konfigurasi multi-GPU.", indent=720)
    b.p("2. Fitur Gamifikasi dan Papan Peringkat: Menambahkan sistem pencatatan skor pengguna, batas waktu perakitan (speedrun assembly challenge), serta sertifikat kelulusan digital berbasis web.", indent=720)
    b.p("3. Dukungan Teknologi WebXR (Virtual Reality & Augmented Reality): Memanfaatkan WebXR API agar pengguna dapat merasakan pengalaman merakit komputer secara imersif menggunakan kacamata VR (VR Headset) atau AR di layar smartphone.", indent=720)
    b.p("4. Pengujian Efektivitas Pembelajaran: Melakukan penelitian lanjutan yang melibatkan sampel responden peserta didik dan tenaga pengajar secara langsung untuk mengukur pengaruh peningkatan pemahaman kognitif siswa sebelum dan sesudah menggunakan website PC Builder 101.", indent=720)
    
    b.page_break()
    
    # ==========================================
    # DAFTAR PUSTAKA
    # ==========================================
    b.p("DAFTAR PUSTAKA", bold=True, size=28, align="center", before=120, after=240)
    
    b.p("Dirksen, J. (2020). Learn Three.js: Programming 3D animations and visualisations for the web with HTML5 and WebGL (3rd ed.). Packt Publishing.", before=60, after=60)
    b.p("Flanagan, D. (2020). JavaScript: The Definitive Guide (7th ed.). O'Reilly Media.", before=60, after=60)
    b.p("Mayer, R. E. (2021). Multimedia learning (3rd ed.). Cambridge University Press.", before=60, after=60)
    b.p("MDN Web Docs. (n.d.). Three.js and WebGL API Documentation. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API", before=60, after=60)
    b.p("MDN Web Docs. (n.d.). Web Audio API Documentation. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API", before=60, after=60)
    b.p("Sutopo, A. H. (2012). Multimedia Interaktif dengan Flash. Graha Ilmu.", before=60, after=60)
    b.p("Three.js Authors. (2024). Three.js Documentation and Manual. https://threejs.org/docs/", before=60, after=60)
    b.p("W3C. (2021). Web Audio API - W3C Recommendation. World Wide Web Consortium. https://www.w3.org/TR/webaudio/", before=60, after=60)
    
    # Simpan DOCX
    b.save(DOCX_PATH)
    print(f"[OK] Sukses membuat dokumen Word: {DOCX_PATH}")

def generate_markdown_report():
    md_content = """# LAPORAN UJIAN TENGAH SEMESTER (UTS) SISTEM MULTIMEDIA
## MEDIA PEMBELAJARAN MULTIMEDIA INTERAKTIF BERBASIS WEBSITE UNTUK PENGENALAN DAN SIMULASI PERAKITAN KOMPUTER 3D (PC BUILDER 101)

**Program Studi:** S1 Ilmu Komputer  
**Fakultas:** Teknik  
**Perguruan Tinggi:** Universitas Bumigora Mataram  
**Tahun Akademik:** 2026  
**Dosen Pengampu:** Ibu Melati Rosanensi, M.Kom.  
**Alamat Demo Website:** [https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app)  
**Repositori GitHub:** [https://github.com/Fanndev/3D-PC-Builder](https://github.com/Fanndev/3D-PC-Builder)

---

### DAFTAR ANGGOTA KELOMPOK PENYUSUN:

| No | Nama Mahasiswa | NIM |
| :---: | :--- | :--- |
| 1 | Muh. Farid Hakim | `2301010211` |
| 2 | Mauulana Habib Al Ansyori | `2301010197` |
| 3 | Mohamad Irfan fadhlurrahman | `2301010162` |
| 4 | Mohammad Syahiddin Danuwarsi Abdussamas | `2301010174` |
| 5 | Arya Ramadhani | `2301010208` |
| 6 | Nabila Umardi | `2301010165` |
| 7 | Muhammad Ferris Naufal | `2301010174` |
| 8 | Muhammad Qodri | `2301010172` |
| 9 | Mu'taman Abid | `2301010189` |
| 10 | Reno Kurniawan | `2301010175` |

---

## KATA PENGANTAR

Puji syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat, taufik, dan karunia-Nya, sehingga penulis dapat menyelesaikan laporan yang berjudul **"Pengembangan Website PC Builder 101 sebagai Media Pembelajaran Multimedia Interaktif 3D Pengenalan dan Perakitan Hardware Komputer"** ini dengan baik dan tepat waktu. Laporan ini disusun sebagai bentuk pertanggungjawaban akademis atas proyek pengembangan website media pembelajaran multimedia yang dikerjakan guna memenuhi Ujian Tengah Semester (UTS) pada mata kuliah Sistem Multimedia.

Laporan ini membahas secara komprehensif proses perancangan dan perekayasaan website PC Builder 101, yaitu media pembelajaran digital berbasis web yang dirancang khusus untuk memfasilitasi mahasiswa maupun siswa dalam memahami arsitektur, fungsi, spesifikasi, dan prosedur pemasangan komponen fisik perangkat keras komputer secara aman melalui visualisasi 3D real-time WebGL (Three.js). Pembahasan di dalam dokumen ini mencakup landasan teori multimedia, metodologi pengembangan Multimedia Development Life Cycle (MDLC) yang mencakup 6 tahap, implementasi 5 unsur multimedia (teks, grafis 3D, audio, video tutorial, serta animasi), hingga analisis hasil pengujian fungsionalitas dan antarmuka sistem.

Penulis menyampaikan rasa terima kasih dan apresiasi yang setinggi-tingginya kepada **Ibu Melati Rosanensi, M.Kom.**, selaku dosen pengampu mata kuliah Sistem Multimedia, atas segala bimbingan, arahan akademis, dan masukan berharga yang diberikan selama proses pengerjaan proyek dan penyusunan laporan ini. Ucapan terima kasih juga penulis haturkan kepada keluarga dan rekan-rekan mahasiswa yang telah memberikan dukungan moral, kerja sama tim, dan motivasi berkesinambungan sehingga proyek ini dapat terwujud secara optimal.

Penulis menyadari sepenuhnya bahwa laporan dan aplikasi website yang dikembangkan ini masih memiliki ruang untuk perbaikan dan penyempurnaan lebih lanjut. Oleh karena itu, penulis sangat mengharapkan saran, tanggapan, dan kritik yang membangun demi kemajuan di masa mendatang. Semoga laporan ini dapat memberikan manfaat nyata, memperluas wawasan keilmuan, serta menjadi referensi bermanfaat bagi pengembangan media pembelajaran multimedia interaktif di lingkungan perguruan tinggi.

Mataram, 19 November 2026  
**Tim Penulis**

---

## DAFTAR ISI

- **KATA PENGANTAR** (ii)
- **DAFTAR ISI** (iii)
- **DAFTAR TABEL** (v)
- **DAFTAR GAMBAR** (vi)
- **BAB I PENDAHULUAN** (1)
  - 1.1 Latar Belakang (1)
  - 1.2 Rumusan Masalah (3)
  - 1.3 Tujuan Pengembangan (3)
  - 1.4 Manfaat Pengembangan (4)
  - 1.5 Batasan Masalah (4)
- **BAB II PEMBAHASAN** (6)
  - 2.1 Multimedia (6)
  - 2.2 Media Pembelajaran (7)
  - 2.3 Website (7)
  - 2.4 Teknologi Pengembangan Website (8)
    - 2.4.1 HTML5 (8)
    - 2.4.2 CSS3 & Responsive Design (9)
    - 2.4.3 JavaScript (ES6+) (9)
    - 2.4.4 WebGL dan Three.js (10)
    - 2.4.5 Web Audio API & Audio Synthesizer (10)
  - 2.5 Unsur Multimedia dalam Pembelajaran (11)
    - 2.5.1 Teks (11)
    - 2.5.2 Gambar dan Model Grafis 3D (12)
    - 2.5.3 Audio (Voice-Over & BIOS Beep Codes) (12)
    - 2.5.4 Video (Video Praktik Perakitan HD) (13)
    - 2.5.5 Animasi (Exploded View, Fan Rotation, Assembly) (13)
  - 2.6 Multimedia Interaktif (14)
  - 2.7 Fitur Pendukung Pembelajaran PC Builder 101 (15)
    - 2.7.1 Eksplorasi Hardware 3D Interaktif (15)
    - 2.7.2 Mode Bedah Komponen (Exploded View) (15)
    - 2.7.3 Simulasi Perakitan Komputer (PC Assembly Simulator) (16)
    - 2.7.4 Kalkulator Kebutuhan Daya (PSU Calculator) (16)
    - 2.7.5 Modul Video Tutorial Praktik Perakitan (17)
    - 2.7.6 Simulator Suara Diagnosa BIOS (Beep Codes & Oscilloscope) (17)
    - 2.7.7 Kuis Evaluasi Pemahaman Interaktif (18)
    - 2.7.8 Komparasi Form Factor Motherboard (18)
  - 2.8 User Interface (UI) dan User Experience (UX) (19)
  - 2.9 Pengujian Website (20)
- **BAB III METODE PENGEMBANGAN** (21)
  - 3.1 Metode Pengembangan (MDLC) (21)
  - 3.2 Tahapan Pengembangan (21)
    - 3.2.1 Concept (Konsep) (22)
    - 3.2.2 Design (Perancangan) (22)
    - 3.2.3 Material Collecting (Pengumpulan Bahan) (23)
    - 3.2.4 Assembly (Pembuatan) (23)
    - 3.2.5 Testing (Pengujian) (24)
    - 3.2.6 Distribution (Distribusi) (24)
  - 3.3 Perangkat yang Digunakan (25)
    - 3.3.1 Perangkat Keras (25)
    - 3.3.2 Perangkat Lunak (25)
  - 3.4 Perancangan Website (26)
    - 3.4.1 Struktur Navigasi (26)
    - 3.4.2 Perancangan Antarmuka (27)
  - 3.5 Implementasi Website dan Multimedia (29)
    - 3.5.1 Implementasi Halaman Utama dan Viewport 3D (29)
    - 3.5.2 Implementasi Fitur Eksplorasi Hardware dan Mode Bedah (30)
    - 3.5.3 Implementasi Unsur Multimedia (31)
    - 3.5.4 Implementasi Simulasi Perakitan Komputer 3D (32)
    - 3.5.5 Implementasi Modul Video Tutorial dan Animasi 2D (33)
    - 3.5.6 Implementasi Simulator Audio BIOS Beep Code & Oscilloscope (33)
    - 3.5.7 Implementasi Kuis Evaluasi dan Kalkulator PSU (34)
  - 3.6 Pengujian Website (35)
- **BAB IV HASIL DAN PEMBAHASAN** (36)
  - 4.1 Gambaran Umum Hasil Pengembangan (36)
  - 4.2 Hasil Implementasi Website (38)
  - 4.3 Hasil Pengujian Website (45)
  - 4.4 Pembahasan (48)
- **BAB V PENUTUP** (54)
  - 5.1 Kesimpulan (54)
  - 5.2 Saran (55)
- **DAFTAR PUSTAKA** (57)

---

## BAB I PENDAHULUAN

### 1.1 Latar Belakang
Perkembangan pesat teknologi informasi dan komputasi di era modern telah mentransformasi berbagai lini kehidupan, terutama dalam bidang pendidikan teknik komputer dan teknologi informasi. Penguasaan terhadap perangkat keras komputer (*computer hardware*) dan kemahiran dalam merakit komputer (*PC assembly*) menjadi fondasi kompetensi yang sangat esensial bagi mahasiswa ilmu komputer, rekayasa perangkat lunak, maupun siswa sekolah kejuruan teknik komputer dan jaringan (TKJ). Pemahaman yang mendalam mengenai letak fisik soket, jenis antarmuka slot ekspansi, sirkulasi termal, serta kompatibilitas daya antar-komponen menentukan keberhasilan perakitan sebuah sistem komputer yang andal dan optimal.

Namun dalam implementasi pembelajaran praktikum perakitan komputer konvensional, terdapat beberapa kendala mendasar yang kerap dihadapi peserta didik maupun institusi pendidikan, antara lain:
1. **Keterbatasan Aksesibilitas dan Biaya Hardware Fisik:** Komponen perangkat keras modern (seperti prosesor soket LGA 1700/AM5, motherboard chipset Z790/B650, memori DDR5, SSD NVMe M.2, dan kartu grafis berdaya tinggi) memiliki nilai ekonomis yang sangat tinggi. Risiko kerusakan fisik akibat kesalahan penanganan pemula (seperti pin soket prosesor bengkok, pelepasan kait RAM yang dipaksakan, atau korsleting akibat listrik statis/ESD) membuat praktikum langsung di laboratorium sering kali dibatasi kuotanya.
2. **Keterbatasan Visualisasi Media 2D Statis:** Buku teks, slide presentasi, atau diagram 2D konvensional tidak mampu memberikan gambaran spasial ruang tiga dimensi yang nyata. Pengguna kesulitan memvisualisasikan orientasi sudut pemasangan heatsink pendingin, peletakan SSD M.2 di balik heatsink pelindung termal, serta jalur sirkulasi udara casing.
3. **Kurangnya Literasi Diagnosa Suara (POST Beep Code):** Pada saat komputer mengalami kegagalan proses booting awal (*Power-On Self-Test / POST*), motherboard memberikan sinyal audio berupa deretan bunyi beep. Banyak peserta didik kesulitan membedakan antara kode beep error memori RAM, kerusakan kartu grafis, maupun masalah pasokan daya tanpa alat peraga interaktif.
4. **Keharusan Pemasangan Perangkat Lunak Khusus:** Banyak aplikasi simulasi 3D yang beredar saat ini mengharuskan pengunduhan dan instalasi aplikasi berkapasitas gigabyte yang membebani perangkat peserta didik dan sulit diakses secara instan.

Berdasarkan permasalahan tersebut, dikembangkan sebuah inovasi media pembelajaran multimedia interaktif berbasis website bernama **PC Builder 101**. Aplikasi ini menghadirkan laboratorium virtual perakitan komputer 3D real-time yang dapat diakses langsung melalui peramban web (*browser*) tanpa instalasi aplikasi tambahan. Dibangun menggunakan teknologi WebGL dan Three.js, PC Builder 101 memodelkan 8 komponen utama komputer secara prosedural dengan material PBR (*Physically Based Rendering*) berkualitas tinggi, menyajikan fitur mode bedah (*Exploded View*), simulasi perakitan 7 langkah terstruktur, video tutorial HD per bab, sintesis suara diagnosa BIOS beep codes dengan osiloskop visual interaktif, kalkulator daya PSU, serta modul kuis evaluasi komprehensif.

### 1.2 Rumusan Masalah
1. Bagaimana merancang dan mengembangkan PC Builder 101 sebagai media pembelajaran multimedia interaktif berbasis website menggunakan Three.js dan WebGL?
2. Bagaimana mengintegrasikan 5 unsur multimedia secara utuh (teks, grafis 3D, audio narasi/synthesizer, video tutorial praktik, dan animasi interaktif) ke dalam platform PC Builder 101?
3. Bagaimana menerapkan fitur interaktif berupa inspeksi 3D 360°, mode bedah (*exploded view*), simulasi perakitan komputer 7 tahap, simulator kode beep BIOS dengan visualisasi gelombang frekuensi, dan kuis evaluasi pemahaman?
4. Bagaimana menyediakan kalkulator kebutuhan daya PSU dan komparasi form factor motherboard untuk mendukung pemahaman teknis pengguna secara mandiri?

### 1.3 Tujuan Pengembangan
1. Mengembangkan media pembelajaran perakitan komputer interaktif berbasis website yang fleksibel, responsif, dan dapat diakses bebas tanpa instalasi software khusus.
2. Mengintegrasikan secara harmonis lima unsur multimedia (teks materi, model grafis 3D real-time, audio voice-over dan efek suara, video tutorial praktik resolusi HD, serta animasi interaktif) untuk memfasilitasi berbagai modalitas gaya belajar.
3. Menyediakan laboratorium virtual 3D yang memungkinkan pengguna memutar sudut pandang bebas (OrbitControls), membedah struktur internal komponen, dan menyimulasikan urutan pemasangan perangkat keras PC secara realistis dan bebas risiko.
4. Mengimplementasikan simulator audio BIOS Beep Code berbasis Web Audio API synthesizer dengan visualisasi osiloskop real-time sebagai media edukasi diagnosa kerusakan perangkat keras.
5. Menyediakan fitur evaluasi pemahaman berupa kuis multimedia interaktif dan alat bantu teknis berupa kalkulator estimasi kebutuhan daya Power Supply (PSU).

### 1.4 Manfaat Pengembangan
1. **Bagi Siswa dan Mahasiswa:** Memperoleh lingkungan belajar virtual yang aman, menarik, dan interaktif untuk mempelajari arsitektur hardware dan urutan perakitan PC tanpa rasa cemas merusakkan komponen berharga mahal.
2. **Bagi Pengajar:** Menjadi media peraga instruksional digital yang dapat diproyeksikan di ruang kelas maupun dibagikan sebagai bahan penugasan praktikum mandiri bagi peserta didik.
3. **Bagi Pengembang:** Mengasah kompetensi dan pengalaman rekayasa perangkat lunak dalam bidang grafika komputer WebGL/Three.js, sintesis audio web, optimasi performa render real-time, dan desain antarmuka modern berstandar industri.
4. **Bagi Pengembangan Media Pembelajaran:** Memberikan tolok ukur implementasi multimedia mutakhir bahwa website modern sanggup menggabungkan simulasi 3D real-time, sintesis audio dinamis, dan video edukatif dalam satu ekosistem terpadu.

### 1.5 Batasan Masalah
1. Produk multimedia berupa website interaktif bernama **PC Builder 101** yang diakses secara daring via peramban web modern.
2. Materi hardware mencakup 8 komponen utama: Motherboard (MSI MPG Z790 Carbon WiFi), CPU (LGA 1700), CPU Cooler (Liquid AIO), RAM DDR5, SSD NVMe M.2, Kartu Grafis (GPU RTX), Catu Daya (PSU ATX), dan Casing Komputer.
3. Seluruh aset 3D dibangun dan dirender secara murni menggunakan pustaka **Three.js (WebGL)** berbasis geometri prosedural, PBR materials, dan kanvas tekstur sirkuit PCB 2D dinamis, bebas ketergantungan file 3D biner eksternal berukuran berat.
4. Unsur multimedia mencakup: teks materi, grafis 3D & SVG, audio suara narasi bahasa Indonesia & simulator beep BIOS, video tutorial praktik perakitan HD 720p, serta animasi transisi dan perakitan.
5. Simulasi perakitan PC 3D mencakup 7 langkah esensial dari instalasi CPU hingga GPU.
6. Modul video tutorial menyajikan materi praktik 4 bab perakitan dengan sulih suara bahasa Indonesia dan alternatif kanvas 2D motion graphic.
7. Distribusi aplikasi melalui platform cloud Vercel dan repositori GitHub.

---

## BAB II PEMBAHASAN

### 2.1 Multimedia
Secara konseptual, multimedia adalah kombinasi terpadu dari berbagai bentuk media (teks, gambar, audio, video, dan animasi) yang diolah dan disajikan melalui media komputer digital. Menurut Mayer (2021) dalam Teori Kognitif Pembelajaran Multimedia (*Cognitive Theory of Multimedia Learning*), manusia menyerap informasi melalui dua saluran terpisah: saluran visual dan saluran verbal/auditori. Penggabungan kata-kata lisan/tulisan dengan representasi visual konkret (seperti model 3D) terbukti secara signifikan melipatgandakan pemahaman konsep teknis dan memperkuat daya ingat jangka panjang peserta didik.

### 2.2 Media Pembelajaran
Media pembelajaran berperan sebagai instrumen mediasi edukatif antara pendidik dan peserta didik. Dalam konteks laboratorium virtual (*virtual lab*), media pembelajaran interaktif memungkinkan siswa melakukan uji coba berulang kali secara mandiri dengan tingkat keterlibatan mental (*active cognitive processing*) yang jauh lebih tinggi dibandingkan membaca buku teks secara pasif.

### 2.3 Website sebagai Platform Pembelajaran
Website menghadirkan keunggulan tanpa tanding dalam hal distribusi konten edukasi:
- **Universal Multi-Device:** Dapat diakses pada laptop, desktop PC, tablet, maupun smartphone.
- **Bebas Hambatan Instalasi (*Zero-Installation*):** Pengguna cukup membuka peramban web (Chrome, Edge, Firefox, Safari) dan memasukkan alamat tautan tanpa unduh berkas installer.
- **Pembaruan Instan:** Segala perbaikan materi atau fitur langsung terbarui secara global saat pengguna menyegarkan halaman.

### 2.4 Teknologi Pengembangan Website
1. **HTML5:** Menyusun kerangka dokumen, kanvas WebGL 3D, pemutar video, serta modal dialog komparasi form factor.
2. **CSS3 & Responsive Design:** Menerapkan estetika *Cyber-Studio Glassmorphism* (`backdrop-filter: blur`, neon glows, transisi halus) dan layout mobile responsif dengan *bottom navigation bar*.
3. **JavaScript (ES6+):** Mengendalikan seluruh logika interaksi, manipulasi 3D Three.js, audio synthesizer, kalkulator PSU, dan sistem kuis evaluasi.
4. **WebGL dan Three.js:** Menghadirkan engine grafika 3D fotorealistik di dalam browser dengan dukungan *PerspectiveCamera*, *OrbitControls*, *MeshStandardMaterial (PBR)*, bayangan lembut *PCFSoftShadowMap*, dan deteksi klik objek 3D *Raycaster*.
5. **Web Audio API:** Mesin suara tingkat tinggi yang mengontrol pemutaran narasi MP3, efek suara interaksi, serta generator gelombang frekuensi kode beep BIOS (*OscillatorNode*) dengan ekstraksi visual osiloskop (*AnalyserNode*).

### 2.5 Unsur Multimedia dalam Pembelajaran
| Unsur Multimedia | Penerapan Nyata di Dalam PC Builder 101 |
| :--- | :--- |
| **1. Teks** | Uraian deskripsi fungsi, spesifikasi teknis, K3 perakitan 8 komponen, tabel komparasi Form Factor ATX, naskah narasi, serta 10 butir soal kuis & pembahasan. |
| **2. Gambar & Model 3D** | Model 3D 8 komponen PC procedural Three.js, tekstur jalur tembaga sirkuit PCB 1024x1024 dinamis, diagram form factor ATX, dan ikon vektor SVG. |
| **3. Audio** | 31 file audio MP3 mencakup voice-over sambutan, voice-over 8 komponen, 7 panduan langkah rakit, 4 narasi bab video, musik latar ambient (BGM), 5 SFX klik, dan generator sintesis kode beep BIOS. |
| **4. Video** | 5 berkas video MP4 HD (1280x720) 30fps tutorial perakitan PC fisik dengan sulih suara bahasa Indonesia (Bab 1 s/d Bab 4 dan Putar Full Video). |
| **5. Animasi** | Mode Bedah 3D (*Exploded View*), rotasi halus kipas pendingin, siklus spektrum lampu ARGB, transisi kamera halus (*Fly-To*), dan animasi penyisipan komponen ke soket motherboard. |

---

## BAB III METODE PENGEMBANGAN

### 3.1 Metode Pengembangan MDLC
Metode yang digunakan adalah **Multimedia Development Life Cycle (MDLC)** menurut Luther-Sutopo, yang terdiri atas 6 tahapan terstruktur:
1. **Concept (Konsep):** Menentukan ide dasar laboratorium virtual 3D perakitan PC berbasis web murni Three.js yang ringan dan edukatif.
2. **Design (Perancangan):** Menyusun struktur navigasi campuran (*composite*), rancangan antarmuka HUD Glassmorphism, naskah storyboard video tutorial, dan skenario perakitan 7 tahap.
3. **Material Collecting (Pengumpulan Bahan):** Menyusun materi hardware, merekam berkas audio suara narasi bahasa Indonesia MP3, menyusun video praktik MP4 HD 720p, mengumpulkan frekuensi kode beep BIOS, serta soal evaluasi.
4. **Assembly (Pembuatan):** Menuliskan kode Three.js prosedural di `scene3d.js`, sistem audio di `audio-engine.js`, alur navigasi dan kuis di `app.js`, data spesifikasi di `data.js`, dan styling di `style.css`.
5. **Testing (Pengujian):** Melakukan pengujian fungsionalitas antarmuka (*Black-Box testing*) di berbagai peramban dan perangkat mobile.
6. **Distribution (Distribusi):** Mempublikasikan aplikasi di cloud hosting Vercel ([https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app)) dan repositori GitHub ([https://github.com/Fanndev/3D-PC-Builder](https://github.com/Fanndev/3D-PC-Builder)).

---

## BAB IV HASIL DAN PEMBAHASAN

### 4.1 Hasil Pengujian Sistem (Black-Box Testing)

| No | Fitur yang Diuji | Hasil | Keterangan Evaluasi |
| :---: | :--- | :---: | :--- |
| 1 | Navigasi Antar-Modul (Floating Island Bar) | Berhasil | Menu Beranda, Eksplorasi, Simulasi, Video, dan Kuis berpindah mulus tanpa reload halaman. |
| 2 | Viewport 3D Three.js & OrbitControls | Berhasil | Model 3D rig komputer dapat diputar 360°, di-zoom in/out, dan di-pan dengan lancar (60 FPS). |
| 3 | Inspeksi 8 Komponen Hardware Komputer | Berhasil | Kamera otomatis bergerak halus (Camera Fly-To) menyorot komponen yang dipilih pada panel kiri. |
| 4 | Mode Bedah Komponen (Exploded View) | Berhasil | Komponen-komponen terpisah secara proporsional dari casing dan kembali merapat saat dinonaktifkan. |
| 5 | Simulasi Perakitan PC 3D (7 Tahapan) | Berhasil | Komponen terpasang satu per satu sesuai urutan instruksi disertai checklist dan audio narasi. |
| 6 | Unsur Audio: Voice-Over & SFX | Berhasil | Audio narasi bahasa Indonesia dapat diputar dan dihentikan; efek klik tombol terdengar jernih. |
| 7 | Unsur Video: Pemutar Video Praktik HD | Berhasil | Video tutorial MP4 720p dapat diputar lancar per bab materi maupun full video 4 bab sekaligus. |
| 8 | Mode Alternatif Simulasi Animasi 2D | Berhasil | Animasi kanvas 2D bergerak dinamis menjelaskan tahapan perakitan sebagai alternatif video MP4. |
| 9 | Simulator Kode Beep BIOS & Oscilloscope | Berhasil | Web Audio API membangkitkan pola beep error dan osiloskop menggambar grafik gelombang real-time. |
| 10 | Kalkulator Kebutuhan Daya PSU | Berhasil | Kalkulasi watt total akurat dan memberikan rekomendasi kapasitas PSU minimum secara otomatis. |
| 11 | Kuis Evaluasi Pemahaman Multimedia | Berhasil | 10 butir pertanyaan berfungsi dengan baik, memberikan skor akhir dan pembahasan lengkap. |
| 12 | Responsivitas Mobile & Touch Gestures | Berhasil | Antarmuka bertransformasi menjadi bottom navigation bar; multi-touch pinch/rotate berfungsi optimal. |

---

## BAB V PENUTUP

### 5.1 Kesimpulan
1. Website **PC Builder 101** sukses direkayasa sebagai media pembelajaran multimedia interaktif 3D berbasis website yang memfasilitasi pengenalan dan simulasi perakitan komputer secara komprehensif, aman, dan tanpa biaya instalasi fisik.
2. Penerapan metodologi **MDLC (Multimedia Development Life Cycle)** melalui 6 tahapannya berhasil memastikan kualitas integrasi sistem dan kelengkapan konten berjalan teratur dan terdokumentasi.
3. Kelima unsur multimedia (teks, grafis 3D, audio narasi/beep, video tutorial MP4 HD, serta animasi interaktif) terintegrasi dengan harmonis sesuai dengan prinsip teori kognitif multimedia Mayer.
4. Seluruh fitur utama (Eksplorasi 3D 360°, Mode Bedah *Exploded View*, Simulasi Rakit 7 Tahap, Lab Video, Simulator Beep BIOS & Live Oscilloscope, Kalkulator Daya PSU, dan Kuis Evaluasi) lulus pengujian Black-Box fungsionalitas dengan tingkat keberhasilan 100%.
5. Website telah aktif dipublikasikan secara daring di [https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app) sehingga dapat diakses oleh civitas akademika dan masyarakat umum kapan pun dan di mana pun.

### 5.2 Saran
1. **Perluasan Ragam Hardware:** Menambahkan variasi arsitektur soket prosesor generasi baru (seperti AMD AM5) serta sistem pendingin kustom cair (*custom open-loop liquid cooling*).
2. **Fitur Gamifikasi:** Menambahkan sistem pencapaian (*badge achievement*) dan tantangan kecepatan perakitan (*speedrun challenge*) untuk meningkatkan motivasi belajar peserta didik.
3. **Eksplorasi WebXR (VR/AR):** Mengembangkan dukungan antarmuka realitas virtual (VR) agar peserta didik dapat merasakan sensasi memegang dan merakit komponen menggunakan kacamata VR interaktif.

---

## DAFTAR PUSTAKA

- Dirksen, J. (2020). *Learn Three.js: Programming 3D animations and visualisations for the web with HTML5 and WebGL* (3rd ed.). Packt Publishing.
- Flanagan, D. (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.
- Mayer, R. E. (2021). *Multimedia learning* (3rd ed.). Cambridge University Press.
- MDN Web Docs. (n.d.). *Three.js and WebGL API Documentation*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
- MDN Web Docs. (n.d.). *Web Audio API Documentation*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Sutopo, A. H. (2012). *Multimedia Interaktif dengan Flash*. Graha Ilmu.
- Three.js Authors. (2024). *Three.js Documentation and Manual*. https://threejs.org/docs/
- W3C. (2021). *Web Audio API - W3C Recommendation*. World Wide Web Consortium. https://www.w3.org/TR/webaudio/
"""
    with open(MD_PATH, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"[OK] Sukses membuat dokumen Markdown: {MD_PATH}")

if __name__ == '__main__':
    generate_report()
    generate_markdown_report()
