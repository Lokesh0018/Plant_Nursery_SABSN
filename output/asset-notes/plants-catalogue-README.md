# Plant catalogue image sheets

Generated with the built-in image_gen tool. Prompts and ordered cell names are recorded in sheet-prompts.json, outdoor-prompts.json and indoor-frames-prompt.txt.

The active catalogue uses 20 shared WebP sheets for 146 category entries. Each sheet contains at most nine frames in left-to-right, top-to-bottom order. Indoor uses a three-column, one-row sheet. All other sheets use three columns and three rows, with unused cells left blank.

src/data/plantCatalogue.json assigns sheet, cell, columns and rows to each card. PlantFrame.jsx clips a scaled shared image in CSS; cards and modals do not request individual cropped files. Native lazy loading and identical URLs allow browser caching across cards. Original earlier PNG sheets and cropped JPEGs are retained as source assets but are not requested by the new catalogue.

Images are illustrations, not photographs of stock or botanical identification evidence. Nursery-specific names and uncertain identifications need confirmation.
