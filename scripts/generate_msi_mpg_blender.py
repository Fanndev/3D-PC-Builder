"""
================================================================================
MSI MPG Z790 CARBON MAX WIFI — 3D PROCEDURAL ASSET GENERATOR FOR BLENDER
================================================================================
Mata Kuliah : Sistem Multimedia (UTS Proyek Praktik)
Program Studi: S1 Ilmu Komputer — Fakultas Teknik
Objek       : Motherboard ATX High-Detail "MSI MPG Z790 CARBON MAX WIFI"
Format      : Blender (.blend) & WebGL Binary glTF (.glb)
Referensi   : MSI MPG Z790 CARBON MAX WIFI (LGA1700, DDR5, PCIe 5.0, Mystic Light)

CARA MENGGUNAKAN DI BLENDER (Blender 3.0 / 3.6 / 4.x):
1. Buka software Blender.
2. Pindah ke tab "Scripting" di menu bar atas.
3. Klik "New" atau "Open" lalu muat file ini (generate_msi_mpg_blender.py).
4. Klik tombol "▶ Run Script" (atau tekan Alt + P).
5. Seluruh model 3D motherboard lengkap dengan bevel chamfer realistis,
   material PBR (Carbon Weave, Brushed Titanium, Mirror Glass, Chrome Steel Armor,
   Gold Contacts, Emissive Mystic Light ARGB, Debug LED 8.8), pencahayaan studio 3-titik,
   kamera, dan setting viewport EEVEE/Cycles akan otomatis dibuat!
6. Skrip ini juga otomatis menyimpan file 'msi_mpg_z790_carbon.blend' dan
   mengekspor 'msi_mpg_z790_carbon.glb' ke folder 'assets/models/'.
================================================================================
"""

import os
import math

try:
    import bpy
except ImportError:
    print("[ERROR] Skrip ini dirancang untuk dijalankan di dalam lingkungan Python Blender.")
    print("Silakan buka Blender, masuk ke tab Scripting, lalu jalankan skrip ini.")
    exit(0)


def clean_scene():
    """Membersihkan seluruh objek default (Cube, Light, Camera bawaan)"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)


def apply_bevel_and_smooth(obj, width=0.004, segments=2):
    """Menambahkan Bevel modifier agar tepian mesh memantulkan specular highlight realistis
    seperti komponen hardware asli, bukan kotak kaku polos."""
    if obj and obj.type == 'MESH':
        mod = obj.modifiers.new(name="Bevel_Edge", type='BEVEL')
        mod.width = width
        mod.segments = segments
        mod.limit_method = 'ANGLE'
        mod.angle_limit = math.radians(35)
        # Aktifkan smooth shading pada polygon
        for p in obj.data.polygons:
            p.use_smooth = True


def create_material(name, base_color, metallic=0.0, roughness=0.5, emission=None, emission_strength=1.0, clearcoat=0.0):
    """Helper untuk membuat material PBR Principled BSDF di Blender dengan dukungan Blender 3.x dan 4.x"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")

    if principled:
        # Base Color (RGBA)
        if 'Base Color' in principled.inputs:
            principled.inputs['Base Color'].default_value = base_color
        if 'Metallic' in principled.inputs:
            principled.inputs['Metallic'].default_value = metallic
        if 'Roughness' in principled.inputs:
            principled.inputs['Roughness'].default_value = roughness

        # Clearcoat untuk mirror glass
        if clearcoat > 0:
            if 'Clearcoat' in principled.inputs:
                principled.inputs['Clearcoat'].default_value = clearcoat
            elif 'Coat Weight' in principled.inputs:  # Blender 4.0+
                principled.inputs['Coat Weight'].default_value = clearcoat

        # Emission
        if emission:
            if 'Emission Color' in principled.inputs:  # Blender 4.0+
                principled.inputs['Emission Color'].default_value = emission
                if 'Emission Strength' in principled.inputs:
                    principled.inputs['Emission Strength'].default_value = emission_strength
            elif 'Emission' in principled.inputs:  # Blender 3.x
                principled.inputs['Emission'].default_value = emission
                if 'Emission Strength' in principled.inputs:
                    principled.inputs['Emission Strength'].default_value = emission_strength

    return mat


def build_msi_mpg_motherboard():
    """Membangun hierarki 3D Motherboard MSI MPG Z790 CARBON MAX WIFI berstandar industri"""
    clean_scene()

    # 1. Koleksi Khusus di Outliner
    collection = bpy.data.collections.new("MSI_MPG_Z790_CARBON_MAX_WIFI")
    bpy.context.scene.collection.children.link(collection)

    # 2. Inisialisasi Material PBR Kelas Premium
    mat_pcb = create_material("Mat_PCB_MatteBlack", (0.024, 0.031, 0.048, 1.0), metallic=0.35, roughness=0.38)
    mat_titanium = create_material("Mat_Brushed_TitaniumDark", (0.058, 0.078, 0.115, 1.0), metallic=0.88, roughness=0.22)
    mat_gunmetal = create_material("Mat_Gunmetal_Shield", (0.095, 0.125, 0.175, 1.0), metallic=0.78, roughness=0.28)
    mat_carbon = create_material("Mat_CarbonFiber_Weave", (0.030, 0.038, 0.052, 1.0), metallic=0.45, roughness=0.35)
    mat_chrome_steel = create_material("Mat_PCIe_SteelArmor", (0.92, 0.94, 0.96, 1.0), metallic=0.98, roughness=0.08)
    mat_silver = create_material("Mat_Silver_Metal", (0.82, 0.86, 0.90, 1.0), metallic=0.92, roughness=0.18)
    mat_gold = create_material("Mat_Gold_Contacts", (0.96, 0.64, 0.08, 1.0), metallic=0.96, roughness=0.12)
    mat_copper = create_material("Mat_Copper_Heatpipe", (0.78, 0.48, 0.18, 1.0), metallic=0.94, roughness=0.16)
    mat_dark_plastic = create_material("Mat_Dark_Plastic", (0.05, 0.07, 0.11, 1.0), metallic=0.15, roughness=0.45)
    mat_mirror_glass = create_material("Mat_Mirror_DragonPlate", (0.02, 0.04, 0.08, 1.0), metallic=0.95, roughness=0.04, clearcoat=1.0)
    mat_mystic_cyan = create_material("Mat_MysticLight_ARGB", (0.0, 0.94, 1.0, 1.0), metallic=0.1, roughness=0.15,
                                      emission=(0.0, 0.94, 1.0, 1.0), emission_strength=7.5)
    mat_debug_red = create_material("Mat_DebugLED_Red", (1.0, 0.12, 0.25, 1.0), metallic=0.1, roughness=0.2,
                                    emission=(1.0, 0.12, 0.25, 1.0), emission_strength=9.0)

    # Root Parent Object
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    root_obj = bpy.context.active_object
    root_obj.name = "Root_Motherboard_MSI_MPG_Z790"

    def add_mesh_obj(obj, name, material=None, bevel=False, bevel_w=0.004):
        obj.name = name
        if material:
            obj.data.materials.append(material)
        if bevel:
            apply_bevel_and_smooth(obj, width=bevel_w, segments=2)
        obj.parent = root_obj
        collection.objects.link(obj)
        bpy.context.scene.collection.objects.unlink(obj)
        return obj

    # -------------------------------------------------------------------------
    # 3. PCB Main Board (Standard ATX 30.5 x 24.4 cm -> skala 2.55 x 3.20 x 0.09)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0), scale=(2.55, 3.20, 0.09))
    add_mesh_obj(bpy.context.active_object, "PCB_Board_ATX_MSI_MPG", mat_pcb, bevel=True, bevel_w=0.002)

    # -------------------------------------------------------------------------
    # 4. Integrated Rear I/O Shroud & Shield Armor (Stealth Black + Dragon Mirror)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.04, 0.84, 0.22), scale=(0.46, 1.48, 0.36))
    add_mesh_obj(bpy.context.active_object, "IO_Armor_Shroud_Main", mat_titanium, bevel=True, bevel_w=0.006)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.08, 1.50, 0.22), scale=(0.38, 0.20, 0.35))
    io_bevel = bpy.context.active_object
    io_bevel.rotation_euler[2] = -0.32
    add_mesh_obj(io_bevel, "IO_Armor_Bevel_Top", mat_gunmetal, bevel=True)

    # Angled Mirror Glass Dragon Crest Plate (Matching Reference Image)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.02, 1.04, 0.42), scale=(0.28, 0.46, 0.025))
    dragon_plate = bpy.context.active_object
    dragon_plate.rotation_euler[2] = 0.12
    add_mesh_obj(dragon_plate, "IO_Dragon_Mirror_Plate", mat_mirror_glass, bevel=True, bevel_w=0.003)

    # Mystic Light ARGB Dragon Underglow
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.02, 1.04, 0.435), scale=(0.22, 0.36, 0.015))
    dragon_glow = bpy.context.active_object
    dragon_glow.rotation_euler[2] = 0.12
    add_mesh_obj(dragon_glow, "IO_Dragon_MysticLight_RGB", mat_mystic_cyan)

    # Silver "msi" Emblem Badge
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.02, 0.72, 0.42), scale=(0.18, 0.06, 0.02))
    add_mesh_obj(bpy.context.active_object, "Emblem_MSI_Silver_Badge", mat_chrome_steel, bevel=True, bevel_w=0.002)

    # Wi-Fi 7 Dual Gold Antenna SMA Connectors
    for yP in [1.40, 1.26]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.038, depth=0.12, location=(-1.28, yP, 0.24))
        sma = bpy.context.active_object
        sma.rotation_euler[1] = math.pi / 2
        add_mesh_obj(sma, "WiFi7_Antenna_SMA_Connector", mat_gold, bevel=True, bevel_w=0.002)

    # Intel 2.5G LAN RJ45 Metal Port
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.26, 0.56, 0.22), scale=(0.12, 0.20, 0.18))
    add_mesh_obj(bpy.context.active_object, "Port_LAN_Intel_2_5G", mat_silver, bevel=True)

    # -------------------------------------------------------------------------
    # 5. VRM Extended Heatsinks & Interconnecting Nickel-Plated Heatpipe
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.70, 0.85, 0.19), scale=(0.32, 1.18, 0.30))
    add_mesh_obj(bpy.context.active_object, "VRM_Heatsink_Left", mat_titanium, bevel=True, bevel_w=0.005)

    # Fin Slices on Left Heatsink
    for f in range(5):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.70, 0.42 + f * 0.21, 0.19), scale=(0.33, 0.022, 0.31))
        add_mesh_obj(bpy.context.active_object, f"VRM_Fin_Slice_{f+1}", mat_gunmetal)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.20, 1.38, 0.18), scale=(1.08, 0.32, 0.28))
    add_mesh_obj(bpy.context.active_object, "VRM_Heatsink_Top", mat_titanium, bevel=True, bevel_w=0.005)

    # Silver "MPG" Badge on Top Heatsink
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.20, 1.42, 0.33), scale=(0.24, 0.08, 0.02))
    add_mesh_obj(bpy.context.active_object, "VRM_Top_MPG_Badge", mat_chrome_steel, bevel=True, bevel_w=0.002)

    # Interconnecting Nickel-Plated Copper Heatpipe
    bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.60, location=(-0.62, 1.12, 0.33))
    add_mesh_obj(bpy.context.active_object, "Heatpipe_Vertical", mat_copper)

    bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.76, location=(-0.24, 1.38, 0.33))
    hp_h = bpy.context.active_object
    hp_h.rotation_euler[1] = math.pi / 2
    add_mesh_obj(hp_h, "Heatpipe_Horizontal", mat_copper)

    # -------------------------------------------------------------------------
    # 6. VRM Power Delivery (19+1+1 Duet Rail Phases: Chokes & Caps)
    # -------------------------------------------------------------------------
    for c in range(8):
        chokeY = 0.44 + c * 0.10
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.48, chokeY, 0.08), scale=(0.065, 0.065, 0.065))
        add_mesh_obj(bpy.context.active_object, f"VRM_Choke_Left_{c+1}", mat_dark_plastic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.07, location=(-0.48, chokeY, 0.14))
        cap = bpy.context.active_object
        cap.rotation_euler[0] = math.pi / 2
        add_mesh_obj(cap, f"VRM_SolidCap_Left_{c+1}", mat_silver)

    for c in range(8):
        chokeX = -0.52 + c * 0.10
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(chokeX, 1.18, 0.08), scale=(0.065, 0.065, 0.065))
        add_mesh_obj(bpy.context.active_object, f"VRM_Choke_Top_{c+1}", mat_dark_plastic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.07, location=(chokeX, 1.18, 0.14))
        cap = bpy.context.active_object
        cap.rotation_euler[0] = math.pi / 2
        add_mesh_obj(cap, f"VRM_SolidCap_Top_{c+1}", mat_silver)

    # -------------------------------------------------------------------------
    # 7. CPU Socket LGA1700 (Intel 12th/13th/14th Gen)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.22, 0.78, 0.065), scale=(0.76, 0.76, 0.04))
    add_mesh_obj(bpy.context.active_object, "Socket_LGA1700_Base", mat_silver, bevel=True)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.22, 0.78, 0.075), scale=(0.70, 0.70, 0.045))
    add_mesh_obj(bpy.context.active_object, "Socket_LGA1700_Frame", mat_chrome_steel, bevel=True)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.22, 0.78, 0.080), scale=(0.50, 0.50, 0.050))
    add_mesh_obj(bpy.context.active_object, "Socket_Protective_Cap", mat_dark_plastic)

    # Socket Load Lever (Tuas Pengunci)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.76, location=(0.16, 0.78, 0.09))
    add_mesh_obj(bpy.context.active_object, "Socket_Load_Lever_Arm", mat_chrome_steel)

    # -------------------------------------------------------------------------
    # 8. [ CARBON MAX ] Heatsink Bar & M.2 Shield Frozr (Matching Reference Image)
    # -------------------------------------------------------------------------
    # Prominent [ CARBON MAX ] Plate directly under Socket
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.15, 0.20, 0.085), scale=(1.20, 0.28, 0.085))
    add_mesh_obj(bpy.context.active_object, "Heatsink_CARBON_MAX_Gen5_Bar", mat_titanium, bevel=True, bevel_w=0.005)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.15, 0.20, 0.13), scale=(1.05, 0.12, 0.015))
    add_mesh_obj(bpy.context.active_object, "Inlay_Carbon_Texture_Strip", mat_carbon)

    # Mounting screws
    for sX in [-0.60, 0.30]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=0.03, location=(sX, 0.20, 0.135))
        sc = bpy.context.active_object
        sc.rotation_euler[0] = math.pi / 2
        add_mesh_obj(sc, "M2_Screw_Mount", mat_silver)

    # Lower Multi-Slot Heatsink Armor
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.15, -0.70, 0.080), scale=(1.15, 0.38, 0.070))
    add_mesh_obj(bpy.context.active_object, "M2_Shield_Frozr_Lower_Armor", mat_gunmetal, bevel=True)

    # -------------------------------------------------------------------------
    # 9. 4x DDR5 Memory Boost Slots & Digital 7-Segment Debug LED (8.8)
    # -------------------------------------------------------------------------
    for i in range(4):
        slotX = 0.45 + i * 0.13
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(slotX, 0.78, 0.08), scale=(0.065, 1.34, 0.08))
        add_mesh_obj(bpy.context.active_object, f"DDR5_Slot_{i+1}", mat_dark_plastic)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(slotX, 0.78, 0.095), scale=(0.068, 1.28, 0.03))
        add_mesh_obj(bpy.context.active_object, f"DDR5_Steel_ArmorStrip_{i+1}", mat_silver)

    # Dual 7-Segment Digital Debug LED ("8.8") at Top-Right Corner
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.96, 1.48, 0.075), scale=(0.18, 0.12, 0.035))
    add_mesh_obj(bpy.context.active_object, "Debug_LED_Display_Housing", mat_dark_plastic, bevel=True, bevel_w=0.002)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.96, 1.48, 0.095), scale=(0.15, 0.09, 0.008))
    add_mesh_obj(bpy.context.active_object, "Debug_LED_Digit_8_8", mat_debug_red)

    # -------------------------------------------------------------------------
    # 10. PCIe 5.0 Steel Armor Primary GPU Slot
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.30, -0.35, 0.08), scale=(1.48, 0.11, 0.11))
    add_mesh_obj(bpy.context.active_object, "PCIe_5_0_Steel_Armor_Primary", mat_chrome_steel, bevel=True, bevel_w=0.003)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.48, -0.35, 0.08), scale=(0.12, 0.14, 0.12))
    add_mesh_obj(bpy.context.active_object, "PCIe_XL_Latch_Clip", mat_gunmetal)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.30, -1.05, 0.08), scale=(1.48, 0.10, 0.09))
    add_mesh_obj(bpy.context.active_object, "PCIe_4_0_Steel_Armor_Secondary", mat_silver, bevel=True)

    # -------------------------------------------------------------------------
    # 11. Polygonal Z790 Chipset Heatsink with Matrix Dots & MPG Emblem
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.66, -0.92, 0.11), scale=(0.82, 0.72, 0.16))
    add_mesh_obj(bpy.context.active_object, "Z790_Chipset_Base_Block", mat_titanium, bevel=True, bevel_w=0.005)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.66, -0.92, 0.19), scale=(0.80, 0.68, 0.04))
    chipset_faceted = bpy.context.active_object
    chipset_faceted.rotation_euler[2] = -0.05
    add_mesh_obj(chipset_faceted, "Z790_Chipset_Faceted_Shield", mat_gunmetal, bevel=True, bevel_w=0.004)

    # Chipset Mystic Light ARGB Border Glow
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.66, -0.92, 0.215), scale=(0.46, 0.08, 0.02))
    add_mesh_obj(bpy.context.active_object, "Chipset_MysticLight_RGB_Accent", mat_mystic_cyan)

    # -------------------------------------------------------------------------
    # 12. Audio Boost 5 Section (ALC4080 Shield & Gold Nichicon Capacitors)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.95, -1.15, 0.07), scale=(0.22, 0.22, 0.06))
    add_mesh_obj(bpy.context.active_object, "Audio_Boost_ALC4080_Shield", mat_silver, bevel=True)

    for a in range(4):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.036, depth=0.09, location=(-0.80, -1.02 - a * 0.09, 0.09))
        gcap = bpy.context.active_object
        gcap.rotation_euler[0] = math.pi / 2
        add_mesh_obj(gcap, f"Audio_Gold_Capacitor_{a+1}", mat_gold, bevel=True, bevel_w=0.002)

    # CMOS Battery CR2032
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.05, location=(-0.85, -0.65, 0.075))
    cmos = bpy.context.active_object
    cmos.rotation_euler[0] = math.pi / 2
    add_mesh_obj(cmos, "CMOS_Battery_CR2032", mat_silver)

    # -------------------------------------------------------------------------
    # 13. Edge Connectors (SATA 6Gbps, 24-Pin ATX, Dual 8-Pin CPU)
    # -------------------------------------------------------------------------
    for s in range(3):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.20, -0.62 - s * 0.16, 0.09), scale=(0.14, 0.12, 0.11))
        add_mesh_obj(bpy.context.active_object, f"SATA_6Gbps_DualPort_{s+1}", mat_dark_plastic)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.15, 0.58, 0.11), scale=(0.14, 0.62, 0.18))
    add_mesh_obj(bpy.context.active_object, "Header_ATX_24Pin_Power", mat_dark_plastic)

    for xP in [-0.82, -0.64]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(xP, 1.52, 0.11), scale=(0.15, 0.12, 0.16))
        add_mesh_obj(bpy.context.active_object, "Header_CPU_8Pin_Power", mat_dark_plastic)

    # -------------------------------------------------------------------------
    # 14. Studio 3-Point Lighting Setup & Ambient Reflection Floor
    # -------------------------------------------------------------------------
    # Key Light Warm White
    bpy.ops.light.primitive_light_add(type='SPOT', radius=1.0, location=(4.5, 6.0, 5.5))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 950.0
    key_light.data.spot_size = math.radians(55)
    key_light.data.color = (1.0, 0.98, 0.95)

    # Rim / Backlight Cyan (Cyberpunk Gaming Accent)
    bpy.ops.light.primitive_light_add(type='POINT', radius=0.8, location=(-4.5, 2.5, 3.8))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light_Cyan"
    rim_light.data.energy = 600.0
    rim_light.data.color = (0.0, 0.94, 1.0)

    # Fill Light Violet/Magenta
    bpy.ops.light.primitive_light_add(type='POINT', radius=1.2, location=(1.5, -4.0, 2.8))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light_Violet"
    fill_light.data.energy = 380.0
    fill_light.data.color = (0.65, 0.35, 0.95)

    # Studio Floor Reflective Backdrop
    mat_floor = create_material("Mat_Studio_Floor", (0.015, 0.02, 0.035, 1.0), metallic=0.7, roughness=0.35)
    bpy.ops.mesh.primitive_plane_add(size=18.0, location=(0, 0, -0.06))
    floor_mesh = bpy.context.active_object
    floor_mesh.name = "Studio_Backdrop_Floor"
    floor_mesh.data.materials.append(mat_floor)

    # -------------------------------------------------------------------------
    # 15. Studio Perspective Camera
    # -------------------------------------------------------------------------
    bpy.ops.object.camera_add(location=(1.8, -4.6, 3.9), rotation=(math.radians(50), 0, math.radians(16)))
    cam = bpy.context.active_object
    cam.name = "Camera_Studio_Hero"
    bpy.context.scene.camera = cam

    # Konfigurasi Render Viewport
    bpy.context.scene.render.engine = 'BLENDER_EEVEE' if hasattr(bpy.context.scene.render, 'engine') else 'CYCLES'

    print("====================================================================")
    print("✅ Model 3D MSI MPG Z790 CARBON MAX WIFI berhasil dibuat di Blender!")
    print("   - Bevel Edge Modifiers: Aktif (Specular Highlight Realistis)")
    print("   - [ CARBON MAX ] Bar: Ditambahkan di bawah LGA1700")
    print("   - Mirror Dragon Plate & Mystic Light ARGB: Aktif")
    print("   - Digital Debug LED '8.8': Ditambahkan di sudut kanan atas")
    print("   - PCIe 5.0 Steel Armor: Chrome Steel Finish")
    print("====================================================================")

    # -------------------------------------------------------------------------
    # 16. Otomatis Simpan .blend dan Ekspor ke .glb
    # -------------------------------------------------------------------------
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "models"))
    os.makedirs(output_dir, exist_ok=True)

    glb_path = os.path.join(output_dir, "msi_mpg_z790_carbon.glb")
    blend_path = os.path.join(output_dir, "msi_mpg_z790_carbon.blend")

    try:
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        print(f"📦 File Blender mentah tersimpan di: {blend_path}")
    except Exception as e:
        print(f"Catatan penyimpanan .blend: {e}")

    try:
        bpy.ops.export_scene.gltf(
            filepath=glb_path,
            export_format='GLB',
            use_selection=False,
            export_materials='EXPORT',
            export_colors=True,
            export_lights=False
        )
        print(f"🚀 Model GLB berhasil diekspor ke: {glb_path}")
    except Exception as e:
        print(f"Catatan ekspor .glb: {e}")


if __name__ == "__main__":
    build_msi_mpg_motherboard()
