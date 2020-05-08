import os
import numpy as np
from xml.dom import minidom
import json

logoXml = minidom.parse('./logo.gexf')
nodes = logoXml.getElementsByTagName('node')
nodes_dict = {node.getAttribute('id') :
              [node.getElementsByTagName('viz:position')[0].attributes.items(),
              node.getAttribute('label')]
              for node in nodes}


# Nodes_dict format:
#   {
#       key : [[x, y, z], label]
#   }
nodes_dict = {k : [[float(v[0][0][1])/50,
                    float(v[0][1][1])/50,
                    float(v[0][2][1])/50], v[1]]
              for k,v in nodes_dict.items()}

nodes_list = [{"position" : v[0],
               "normal": [0, 0, 0],
               "color": [0, 0, 0], 
               "label" : v[1]}
                for k,v in nodes_dict.items()]


edges = logoXml.getElementsByTagName('edge')


edges_list = [  {
                    "from" : {
                        "label" : nodes_dict[edge.getAttribute('source')][1],
                        "coordinates" : nodes_dict[edge.getAttribute('source')][0],
                     },
                    "to" :  {
                        "label" : nodes_dict[edge.getAttribute('target')][1],
                        "coordinates" : nodes_dict[edge.getAttribute('target')][0]
                    }
                }
                for edge in edges ]

dtype_attr  = [('X', '<i4'),
               ('Y', '<i4'),
               ('Z', '<i4'),
               ('intensity', '<u2'),
               ('bit_fields', 'u1'),
               ('raw_classification', 'u1'),
               ('scan_angle_rank', 'i1'),
               ('user_data', 'u1'),
               ('point_source_id', '<u2'),
               ('gps_time', '<f8'),
               ('red', '<u2'),
               ('green', '<u2'),
               ('blue', '<u2')]
with open('edges.json', "w") as file:
    json.dump(edges_list, file)

with open('nodes.json', "w") as file:
    json.dump(nodes_list, file)
