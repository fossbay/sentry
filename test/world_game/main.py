import geopandas as gpd
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from shapely.geometry import Polygon
from enum import Enum

class Status(Enum):
    UNOCCUPIED = 1 # no emoji
    OCCUPIED = 2 # 🏳️
    INVADED = 3 # ⚔️

class State():
    name = ""
    id = ""
    geometry = Polygon()
    color = ""
    edgecolor = ""
    status: Status = Status.UNOCCUPIED

    def __init__(self, name, id, geometry, color, edgecolor, status=Status.UNOCCUPIED):
        self.name = name
        self.id = id
        self.geometry = geometry
        self.color = color
        self.edgecolor = edgecolor
        self.status = status

    def to_list(self):
        return [self.name, self.id, self.geometry, self.color, self.edgecolor, self.status]

# Load state data
gdf = gpd.read_file("./usa.json")

# if Hawaii or Alaska is included, remove it
indexes = []
non_states = ["Alaska", "Hawaii", "Puerto Rico", "District of Columbia"]
for i in range(len(gdf)):
    if gdf.iloc[i]["NAME"] in non_states:
        indexes.append(i)

gdf = gdf.drop(indexes)

# Separate the states into individual arrays (include name, id, and coordinates)
states: list[State] = []
for i in range(len(gdf)):
    # states.append([gdf.iloc[i]["NAME"], gdf.iloc[i]["GEO_ID"], gdf.iloc[i]["geometry"], "white", "black"])        
    states.append(State(gdf.iloc[i]["NAME"], gdf.iloc[i]["GEO_ID"], gdf.iloc[i]["geometry"], "white", "black"))

# Change the color of the states (Cali is red, Texas is blue, Florida is green, and New York is yellow)
for i in range(len(states)):
    if states[i].name == "California" or states[i].name == "Nevada":
        states[i].color = "red"
    elif states[i].name == "Texas" or states[i].name == "Louisiana":
        states[i].color = "blue"
    elif states[i].name == "Florida":
        states[i].color = "green"
    elif states[i].name == "New York":
        states[i].color = "yellow"
    elif states[i].name == "Illinois":
        states[i].color = "orange"

# Oh no, texas is invading oklahoma. Add an emoji to the map to show this
for i in range(len(states)):
    if states[i].name == "Oklahoma":
        states[i].status = Status.INVADED
    elif states[i].name == "Nevada":
        states[i].status = Status.OCCUPIED
    elif states[i].name == "Louisiana":
        states[i].status = Status.OCCUPIED

# save an image of the map with states colored using the color array; also add emojis to the map
fig, ax = plt.subplots(figsize=(10, 10))
ax.axis('off')
# update the plot to include the updated states
states_list = [state.to_list() for state in states]
gdf = gpd.GeoDataFrame(states_list, columns=["NAME", "GEO_ID", "geometry", "color", "edgecolor", "status"])

prop = FontProperties(fname='/System/Library/Fonts/Apple Color Emoji.ttc')
plt.rcParams['font.family'] = prop.get_family()

# add emojis to the map
for i in range(len(states)):
    match states[i].status:
        case Status.UNOCCUPIED:
            pass
        case Status.OCCUPIED:
            ax.annotate("🏳️", (states[i].geometry.centroid.x, states[i].geometry.centroid.y), ha='center', va='center', fontsize=10)
        case Status.INVADED:
            ax.annotate("⚔️", (states[i].geometry.centroid.x, states[i].geometry.centroid.y), ha='center', va='center', fontsize=10)
    


ax.plot(ax=ax, color=[state.color for state in states], edgecolor=[state.edgecolor for state in states], linewidth=0.5)

plt.show()

# save the image but zoomed in
# plt.savefig("usa.png", dpi=300)

# save the new states to a geojson file
# gdf.to_file("new-usa.geojson", driver='GeoJSON')

