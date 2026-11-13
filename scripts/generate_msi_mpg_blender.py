"""
================================================================================
MSI MPG Z790 CARBON WIFI — 3D PROCEDURAL ASSET GENERATOR FOR BLENDER
================================================================================
Mata Kuliah : Sistem Multimedia (UTS Proyek Praktik)
Program Studi: S1 Ilmu Komputer — Fakultas Teknik
Objek       : Motherboard ATX High-Detail "MSI MPG Z790 CARBON WIFI"
Format      : Blender (.blend) & WebGL Binary glTF (.glb)

CARA MENGGUNAKAN DI BLENDER (Blender 3.0 / 3.6 / 4.x):
1. Buka software Blender.
2. Pindah ke tab "Scripting" di menu bar atas.
3. Klik "New" atau "Open" lalu muat file ini (generate_msi_mpg_blender.py).
4. Klik tombol "▶ Run Script" (atau tekan Alt + P).
5. Seluruh model 3D motherboard lengkap dengan material PBR (Carbon, Brushed
   Titanium, Chrome Steel Armor, Gold Pins, Emissive Mystic Light ARGB),
   pencahayaan studio 3-titik, dan kamera akan otomatis terbuat!
6. Skrip ini juga otomatis menyimpan file 'msi_mpg_z790_carbon.blend' dan
   mengekspor 'msi_mpg_z790_carbon.glb' ke dalam folder 'assets/models/'.
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


def create_material(name, base_color, metallic=0.0, roughness=0.5, emission=None, emission_strength=1.0):
    """Helper untuk membuat material PBR Principled BSDF di Blender"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")

    if principled:
        # Base Color (RGBA)
        principled.inputs['Base Color'].default_value = base_color
        principled.inputs['Metallic'].default_value = metallic
        principled.inputs['Roughness'].default_value = roughness

        if emission and 'Emission Color' in principled.inputs:
            principled.inputs['Emission Color'].default_value = emission
            principled.inputs['Emission Strength'].default_value = emission_strength
        elif emission and 'Emission' in principled.inputs:
            principled.inputs['Emission'].default_value = emission
            if 'Emission Strength' in principled.inputs:
                principled.inputs['Emission Strength'].default_value = emission_strength

    return mat


def build_msi_mpg_motherboard():
    """Membangun hierarki 3D Motherboard MSI MPG Z790 CARBON WIFI"""
    clean_scene()

    # 1. Koleksi Khusus
    collection = bpy.data.collections.new("MSI_MPG_Z790_CARBON_WIFI")
    bpy.context.scene.collection.children.link(collection)

    # 2. Inisialisasi Material PBR
    mat_pcb = create_material("Mat_PCB_CarbonBlack", (0.027, 0.039, 0.071, 1.0), metallic=0.35, roughness=0.32)
    mat_titanium = create_material("Mat_Titanium_Dark", (0.094, 0.125, 0.184, 1.0), metallic=0.88, roughness=0.22)
    mat_gunmetal = create_material("Mat_Gunmetal", (0.118, 0.161, 0.231, 1.0), metallic=0.75, roughness=0.30)
    mat_chrome_steel = create_material("Mat_PCIe_SteelArmor", (0.886, 0.910, 0.941, 1.0), metallic=0.98, roughness=0.10)
    mat_gold = create_material("Mat_Gold_Contacts", (0.961, 0.620, 0.043, 1.0), metallic=0.96, roughness=0.12)
    mat_copper = create_material("Mat_Copper_Heatpipe", (0.761, 0.471, 0.169, 1.0), metallic=0.92, roughness=0.18)
    mat_dark_plastic = create_material("Mat_Dark_Plastic", (0.067, 0.094, 0.153, 1.0), metallic=0.20, roughness=0.48)
    mat_silver = create_material("Mat_Silver_Metal", (0.796, 0.835, 0.882, 1.0), metallic=0.92, roughness=0.18)
    mat_mystic_cyan = create_material("Mat_MysticLight_RGB", (0.0, 0.94, 1.0, 1.0), metallic=0.1, roughness=0.15,
                                      emission=(0.0, 0.94, 1.0, 1.0), emission_strength=6.0)

    # Root Parent Object
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    root_obj = bpy.context.active_object
    root_obj.name = "Root_Motherboard_MSI_MPG"

    # Helper penaut parent
    def add_mesh_obj(obj, name, material=None):
        obj.name = name
        if material:
            obj.data.materials.append(material)
        obj.parent = root_obj
        collection.objects.link(obj)
        bpy.context.scene.collection.objects.unlink(obj)
        return obj

    # -------------------------------------------------------------------------
    # 3. PCB Board (Standar ATX: 2.55 x 3.20 x 0.09)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0), scale=(2.55, 3.20, 0.09))
    pcb = add_mesh_obj(bpy.context.active_object, "PCB_Board_ATX", mat_pcb)

    # -------------------------------------------------------------------------
    # 4. Integrated Rear I/O Shroud & Shield Armor (MSI Extended Heatsink)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.04, 0.84, 0.22), scale=(0.46, 1.48, 0.36))
    io_armor = add_mesh_obj(bpy.context.active_object, "IO_Armor_Shroud", mat_titanium)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.08, 1.50, 0.22), scale=(0.38, 0.20, 0.35))
    io_bevel = bpy.context.active_object
    io_bevel.rotation_euler[2] = -0.32
    add_mesh_obj(io_bevel, "IO_Armor_Bevel", mat_gunmetal)

    # Emblem Naga MSI / "MPG" RGB Mystic Light
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.04, 0.95, 0.415), scale=(0.24, 0.32, 0.02))
    add_mesh_obj(bpy.context.active_object, "Emblem_MSI_Dragon_RGB", mat_mystic_cyan)

    # Wi-Fi 6E/7 Dual Gold Antenna SMA Connectors
    for yP in [1.40, 1.26]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.038, depth=0.12, location=(-1.28, yP, 0.24))
        sma = bpy.context.active_object
        sma.rotation_euler[1] = math.pi / 2
        add_mesh_obj(sma, "WiFi_Antenna_SMA_Connector", mat_gold)

    # Intel 2.5G LAN RJ45 Metal Port
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-1.26, 0.56, 0.22), scale=(0.12, 0.20, 0.18))
    add_mesh_obj(bpy.context.active_object, "Port_LAN_Intel_2_5G", mat_silver)

    # -------------------------------------------------------------------------
    # 5. VRM Extended Heatsinks & Interconnecting Heatpipe
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.70, 0.85, 0.19), scale=(0.32, 1.18, 0.30))
    add_mesh_obj(bpy.context.active_object, "VRM_Heatsink_Left", mat_titanium)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.20, 1.38, 0.18), scale=(1.08, 0.32, 0.28))
    add_mesh_obj(bpy.context.active_object, "VRM_Heatsink_Top", mat_titanium)

    # Nickel-Plated Copper Heatpipe
    bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.60, location=(-0.62, 1.12, 0.33))
    add_mesh_obj(bpy.context.active_object, "Heatpipe_Vertical", mat_copper)

    bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.76, location=(-0.24, 1.38, 0.33))
    hp_h = bpy.context.active_object
    hp_h.rotation_euler[1] = math.pi / 2
    add_mesh_obj(hp_h, "Heatpipe_Horizontal", mat_copper)

    # -------------------------------------------------------------------------
    # 6. VRM Power Delivery (19+1+1 Duet Rail Phases: Chokes & Solid Caps)
    # -------------------------------------------------------------------------
    for c in range(8):
        chokeY = 0.44 + c * 0.10
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.48, chokeY, 0.08), scale=(0.065, 0.065, 0.065))
        add_mesh_obj(bpy.context.active_object, f"VRM_Choke_Left_{c}", mat_dark_plastic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.07, location=(-0.48, chokeY, 0.14))
        cap = bpy.context.active_object
        cap.rotation_euler[0] = math.pi / 2
        add_mesh_obj(cap, f"VRM_Capacitor_Left_{c}", mat_silver)

    for c in range(8):
        chokeX = -0.52 + c * 0.10
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(chokeX, 1.18, 0.08), scale=(0.065, 0.065, 0.065))
        add_mesh_obj(bpy.context.active_object, f"VRM_Choke_Top_{c}", mat_dark_plastic)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.024, depth=0.07, location=(chokeX, 1.18, 0.14))
        cap = bpy.context.active_object
        cap.rotation_euler[0] = math.pi / 2
        add_mesh_obj(cap, f"VRM_Capacitor_Top_{c}", mat_silver)

    # -------------------------------------------------------------------------
    # 7. CPU Socket LGA1700 (Intel Socket)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.22, 0.78, 0.065), scale=(0.76, 0.76, 0.04))
    add_mesh_obj(bpy.context.active_object, "Socket_LGA1700_Base", mat_silver)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.22, 0.78, 0.075), scale=(0.70, 0.70, 0.045))
    add_mesh_obj(bpy.context.active_object, "Socket_LGA1700_Frame", mat_chrome_steel)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.22, 0.78, 0.080), scale=(0.50, 0.50, 0.050))
    add_mesh_obj(bpy.context.active_object, "Socket_Protective_Cap", mat_dark_plastic)

    # Load Lever (Tuas Pengunci)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.76, location=(0.16, 0.78, 0.09))
    add_mesh_obj(bpy.context.active_object, "Socket_Load_Lever_Arm", mat_chrome_steel)

    # -------------------------------------------------------------------------
    # 8. 4x DDR5 Memory Boost Slots
    # -------------------------------------------------------------------------
    for i in range(4):
        slotX = 0.45 + i * 0.13
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(slotX, 0.78, 0.08), scale=(0.065, 1.34, 0.08))
        add_mesh_obj(bpy.context.active_object, f"DDR5_Slot_{i+1}", mat_dark_plastic)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(slotX, 0.78, 0.095), scale=(0.068, 1.28, 0.03))
        add_mesh_obj(bpy.context.active_object, f"DDR5_ArmorStrip_{i+1}", mat_silver)

    # -------------------------------------------------------------------------
    # 9. PCIe Expansion Slots (PCIe 5.0 Steel Armor)
    # -------------------------------------------------------------------------
    # PCIe 5.0 x16 Primary (Slot Kartu Grafis dengan Steel Armor)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.30, -0.35, 0.08), scale=(1.48, 0.11, 0.11))
    add_mesh_obj(bpy.context.active_object, "PCIe_5_0_Steel_Armor_Primary", mat_chrome_steel)

    # MSI XL PCIe Release Clip
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.48, -0.35, 0.08), scale=(0.12, 0.14, 0.12))
    add_mesh_obj(bpy.context.active_object, "PCIe_XL_Release_Clip", mat_gunmetal)

    # PCIe 4.0 x16 Secondary
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.30, -1.05, 0.08), scale=(1.48, 0.10, 0.09))
    add_mesh_obj(bpy.context.active_object, "PCIe_4_0_Steel_Armor_Secondary", mat_silver)

    # -------------------------------------------------------------------------
    # 10. M.2 Shield Frozr Heatsinks (Lightning Gen 5 & Multi-Slot Lower)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.15, 0.16, 0.085), scale=(0.96, 0.26, 0.075))
    add_mesh_obj(bpy.context.active_object, "M2_Shield_Frozr_Gen5_Top", mat_titanium)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.15, -0.70, 0.080), scale=(1.15, 0.38, 0.070))
    add_mesh_obj(bpy.context.active_object, "M2_Shield_Frozr_Lower_MultiSlot", mat_gunmetal)

    # -------------------------------------------------------------------------
    # 11. Audio Boost 5 Section (Isolated Codec & Gold Capacitors)
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.95, -1.15, 0.07), scale=(0.22, 0.22, 0.06))
    add_mesh_obj(bpy.context.active_object, "Audio_Boost_ALC4080_Shield", mat_silver)

    for a in range(4):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.036, depth=0.09, location=(-0.80, -1.02 - a * 0.09, 0.09))
        gcap = bpy.context.active_object
        gcap.rotation_euler[0] = math.pi / 2
        add_mesh_obj(gcap, f"Audio_Gold_Capacitor_{a+1}", mat_gold)

    # -------------------------------------------------------------------------
    # 12. Z790 Chipset Heatsink (PCH) & Mystic Light ARGB Badge
    # -------------------------------------------------------------------------
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.66, -0.92, 0.12), scale=(0.78, 0.68, 0.18))
    add_mesh_obj(bpy.context.active_object, "Z790_Chipset_Heatsink", mat_titanium)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.66, -0.92, 0.125), scale=(0.46, 0.10, 0.20))
    add_mesh_obj(bpy.context.active_object, "Chipset_MPG_Emblem_RGB", mat_mystic_cyan)

    # CMOS Battery CR2032
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.05, location=(-0.85, -0.65, 0.075))
    cmos = bpy.context.active_object
    cmos.rotation_euler[0] = math.pi / 2
    add_mesh_obj(cmos, "CMOS_Battery_CR2032", mat_silver)

    # -------------------------------------------------------------------------
    # 13. Edge Connectors (6x SATA Ports, 24-Pin ATX Header)
    # -------------------------------------------------------------------------
    for s in range(3):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.20, -0.62 - s * 0.16, 0.09), scale=(0.14, 0.12, 0.11))
        add_mesh_obj(bpy.context.active_object, f"SATA_6Gbps_DualPort_{s+1}", mat_dark_plastic)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.15, 0.58, 0.11), scale=(0.14, 0.62, 0.18))
    add_mesh_obj(bpy.context.active_object, "Header_ATX_24Pin_Power", mat_dark_plastic)

    # -------------------------------------------------------------------------
    # 14. Studio 3-Point Lighting Setup
    # -------------------------------------------------------------------------
    # Key Light
    bpy.ops.light.primitive_light_add(type='SPOT', radius=1.0, location=(5.0, 7.0, 6.0))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 850.0
    key_light.data.color = (1.0, 0.98, 0.95)

    # Rim / Backlight Cyan (Cyberpunk Gaming Accent)
    bpy.ops.light.primitive_light_add(type='POINT', radius=0.8, location=(-5.0, 3.0, 4.0))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light_Cyan"
    rim_light.data.energy = 550.0
    rim_light.data.color = (0.0, 0.94, 1.0)

    # Fill Light Purple
    bpy.ops.light.primitive_light_add(type='POINT', radius=1.2, location=(2.0, -4.0, 3.0))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light_Purple"
    fill_light.data.energy = 320.0
    fill_light.data.color = (0.65, 0.35, 0.95)

    # -------------------------------------------------------------------------
    # 15. Studio Perspective Camera
    # -------------------------------------------------------------------------
    bpy.ops.object.camera_add(location=(1.5, -4.5, 3.8), rotation=(math.radians(52), 0, math.radians(18)))
    cam = bpy.context.active_object
    cam.name = "Camera_Studio_Overview"
    bpy.context.scene.camera = cam

    print("====================================================================")
    print("✅ Model 3D MSI MPG Z790 CARBON WIFI berhasil dibuat di Blender!")
    print("====================================================================")

    # -------------------------------------------------------------------------
    # 16. Otomatis Simpan .blend dan Ekspor ke .glb (Jika folder assets tersedia)
    # -------------------------------------------------------------------------
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "models"))
    os.makedirs(output_dir, exist_ok=True)

    glb_path = os.path.join(output_dir, "msi_mpg_z790_carbon.glb")
    blend_path = os.path.join(output_dir, "msi_mpg_z790_carbon.blend")

    try:
        # Simpan file mentah Blender
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        print(f"📦 File mentah Blender tersimpan di: {blend_path}")
    except Exception as e:
        print(f"Catatan penyimpanan .blend: {e}")

    try:
        # Ekspor ke glTF Binary (.glb)
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
