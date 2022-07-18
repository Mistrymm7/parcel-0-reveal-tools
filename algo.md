# Algorithms

## Dividing the Parcel into Plots

### Inputs

1. KML File
2. Number of Parcels

### Outputs

1. Subplots kml and geojson

### Requirements

1. QGIS

### Algorithm

1. Plot Divider Plugin by Dr. Johnny Huck : https://jonnyhuck.co.uk/


## Creating Images for Each Plot

* KML IPFS : ipfs://bafybeieypckzw36w2zolhyttkef6oa2zhuldutljccse66jbakvdxkfyym
* NFT Images IPFS : ipfs://bafybeihyqxva6t4lrsrarkjqptksa6jvaerrynd4nouwh66zqszqzgbeni
* NFT Metadata IPFS : ipfs://bafybeia3lejponr2skhobnhbcoauf4ldvwylpwcqmwgocqx2ustsqx6bby

### Inputs

1. Tif file of the main plot
2. Geojson containing polygon data of subplots

### Outputs

1. Subplot PNG Images

### Requirements

1. Gdal, Rasterio : Python libraries for tif processing and masking
2. Pyproj, fiona : Python libraries for Coordinate Reference System (CRS) and Conversion
3. Pil : Python library for Image Processing


### Algorithm

1. Parse tif file using Rasterio 
2. Note Coordinate Reference System (CRS) of tif file and render the plot image
3. Parse geojson file 
4. Note Coordinate Reference System (CRS) of geojson file
5. Do CRS tranformation of geojson file to match with tif file
6. Mask individual plot shapes from tif file using rasterio.mask algorithm : https://rasterio.readthedocs.io/en/latest/api/rasterio.mask.html
7. Convert white background into transparent PNG using PIL as rasterio mask fills up image with white background to have a rectanglar image of irregular shapes
8. Draw grid in plot images and resize it 320x320 and 15 px padding on all sides to make it 350x350 which is recommended image size by OpenSea

## Assigning NFTs to Plots

### Inputs

1. JSON File of Plots in geojson format, identified with unique IDs
2. JSON File of NFTs and owner addresses

### Outputs

1. JSON File of NFT id to Plot ID

### Requirements

1. 1 Plot per NFT
2. Keep NFTs together for each owner address
3. Use a snapshot of NFT owners taken at a particular time

### Algorithm

#### Plot Preprocessing

1. Put all plots into a map hashed by plot ID
2. Add a marker to each plot to indicate whether it has been used
3. Put all plot edges into a map hashed by normalized edge. 
   For each edge of each plot:
   1. Determine the slope of the edge
   2. Normalize the size of the edge to a height of 1
   3. Normalize the location of the lowest point of the edge to Y origin (0)
   4. Store the normalized edge with the original edge
   5. Use the normalized edge as the key to the map
   6. Store a tuple of the plot and the original edge into a list as the value 
      of the map
4. Create a graph of plots and their neighbors.
   For each edge of each plot:
   1. Look up other plots with the same normalized edges.
      For each plot on the same line that is not already a neighbor:
      1. Determine if there are any edges in this plot that overlap the 
         original edge
      2. If so, create neighbor links from the original plot to this plot and 
         vice versa

#### Owner Address Preprocessing

1. Group NFTs by owner address
2. Order owner addresses by # of NFTs owned, descending (ie most owned first)
3. Order NFTs per owner address by NFT id, ascending (ie lowest first) 

#### Determine Plot for each NFT

Create a map to store Plot IDs (value) by NFT ID (key).

For each owner address in order defined above:
1. Pick the first NFT in the list, determined by the order above
2. Randomly choose a plot
3. If the chosen plot is not available, go to #2
4. The chosen plot is available, so:
   1. add the Plot ID to the map
   2. mark the Plot used
   3. add the Plot to the list of plots owned by the owner address
5. If there are more NFTs in the owner's list, pick the next NFT in the list
6. Pick the first plot that the owner owns
7. Randomly pick a neighboring plot using the graph created above
8. If the chosen plot is not available and there are more neighboring plots, 
   go to #7
9. If the chosen plot is not available and the owner owns more plots,
   pick the next plot that the owner owns and go to #7
10. If the chosen plot is not available, go to #2
11. The chosen plot is available, so go to #4
