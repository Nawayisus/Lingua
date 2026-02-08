from playwright.sync_api import sync_playwright
import sys

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
        except Exception as e:
            print(f"Error connecting to server: {e}")
            sys.exit(1)

        # Check Labels
        labels = [
            ("sourceLang", "Idioma Original"),
            ("targetLang", "Idioma Destino"),
            ("outputFormat", "Formato de Salida"),
            ("providerSelect", "Proveedor de Traducción")
        ]

        errors = []

        for input_id, label_text in labels:
            label = page.locator(f"label[for='{input_id}']")
            if label.count() == 0:
                # Try finding label by text just to see if it exists but missing for
                text_label = page.locator("label", has_text=label_text)
                if text_label.count() > 0:
                    errors.append(f"Label '{label_text}' exists but missing 'for={input_id}'")
                else:
                    errors.append(f"Label '{label_text}' not found")
            else:
                print(f"✅ Label for {input_id} found.")

        # Check Upload Area
        drop_zone = page.locator("#dropZone")
        tag_name = drop_zone.evaluate("el => el.tagName")
        if tag_name.lower() != "label":
             errors.append(f"DropZone is currently <{tag_name}>, expected <label>")
        else:
             print("✅ DropZone is a <label>")

        file_input = page.locator("#fileInput")
        # Check class
        class_list = file_input.get_attribute("class")

        if "d-none" in class_list:
            errors.append("FileInput has 'd-none' class (should be 'visually-hidden' or similar accessible hiding)")
        elif "visually-hidden" not in class_list:
            errors.append("FileInput missing 'visually-hidden' class")
        else:
            print("✅ FileInput uses 'visually-hidden'")

        browser.close()

        if errors:
            print("\n❌ Errors found:")
            for e in errors:
                print(f"  - {e}")
            sys.exit(1)
        else:
            print("\n✅ All checks passed!")

if __name__ == "__main__":
    run()
