import os
import numpy as np
from laspy.file import File
from xml.dom import minidom
import pylas

logoXml = minidom.parse('./logo.gexf')
nodes = logoXml.getElementsByTagName('node')
nodes_dict = {node.getAttribute('id') :
              [node.getElementsByTagName('viz:position')[0].attributes.items(),
              node.getAttribute('label')]
              for node in nodes}

# Nodes_dict format:
#   {
#       key : [(x, y, z), label]
#   }
nodes_dict = {k:[(v[0][0][1], v[0][1][1], v[0][2][1]), v[1]]
              for k,v in nodes_dict.items()}


edges = logoXml.getElementsByTagName('edge')

# Edges_with_coor format:
# [ ((x1, y1, z1) , (x2, y2, z2)) ]

edges_with_coor = [(nodes_dict[edge.getAttribute('source')][0],
                    nodes_dict[edge.getAttribute('target')][0])
                    for edge in edges]


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

points = []
for node in nodes_dict:
    pos = nodes_dict[node][0]
    node_prop = (float(pos[0]), float(pos[1]), float(pos[2]),
                 0, 9, 0, 0, 0, 0, 0., 0, 0, 0)
    points.append(node_prop)

inFile = File('./indoor.0.1.laz', mode='r')
outFile = File('./ouptut.laz', mode='w', header=inFile.header)
outFile.points = np.array(arr, dtype=dtype_attr)
outFile.close()
