import numpy as np
import pandas as pd

def toLowerCase(row):
    returnRow = []
    for game in row:
        returnRow.append(game.lower())
    return returnRow

game_features = pd.read_csv('data/games-features-test.csv')
players = pd.read_csv('data/steam-200k.csv')
players=players.drop(['Hours'],axis=1)
players = players.drop(players[players.Behavior == 'play'].index)



g = players.groupby('User_ID').Name
player_list = pd.concat([g.apply(list),g.count()],axis=1,keys=['games','count'])
player_list = player_list.drop(player_list[player_list['count']==1].index)
player_list['games'] = player_list['games'].apply(toLowerCase)
player_list['games'] = player_list['games'].apply(sorted)
game_list = players['Name'].unique()
print(game_list)
print(player_list)
source = {}
edgeDegree = {}

def getEdgeList():
    for index,row in player_list.iterrows():
        games = row['games']
        for i in range(len(games)-1):
            if i not in source:
                source[games[i]] = []
            for j in range(i+1,len(games)):
                if games[j] not in source[games[i]]:
                    source[games[i]].append(games[j])
                    edgeDegree[(games[i],games[j])] = 0
                edgeDegree[(games[i],games[j])] += 1
    print(set(list(edgeDegree.values())))
    # with open('network.txt','x') as the_file:
    #     the_file.write('{\n "nodes":[\n')
    #     for game in game_list:
    #         the_file.write('{"id": "'+game.lower()+'"},\n')
    #     the_file.write('],\n "links":[\n')
    #     for key,value in source.items():
    #         for target in value:
    #             the_file.write('{"source": "' + key + '", "target": "' + target +'"},\n')
    #     the_file.write(']\n}')

getEdgeList()
