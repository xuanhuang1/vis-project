import numpy as np
import pandas as pd

def toLowerCase(row):
    returnRow = []
    for game in row:
        returnRow.append(game.lower())
    return returnRow

def transformation(titleName):

    titleName = str(titleName)
    result = ''.join(e for e in titleName if e.isalnum())
    return result.lower()


game_features = pd.read_csv('data/games-features-utf.csv')
players = pd.read_csv('data/steam-200k.csv')
players=players.drop(['Hours'],axis=1)

game_features = game_features.drop(['QueryID','ResponseID'],axis=1)

game_features['queryname'] = game_features['QueryName'].apply(transformation)

game_features['responsename'] = game_features['ResponseName'].apply(transformation)
players['Name'] = players['Name'].apply(transformation)
players = players.drop(players[players.Behavior == 'play'].index)
players = players[~players.Name.str.contains('dlc')]

def switchToIndex(gameTitle):
    result = game_features.index[(game_features['queryname'] == gameTitle )| (game_features['responsename'] == gameTitle)].tolist()
    if len(result)==0:
        result = [-1]
    return result[0]


players['TitleIndex'] = players['Name'].apply(switchToIndex)
unmatched = players.loc[players['TitleIndex']==-1]['Name'].unique()


players = players[~players['Name'].isin(unmatched)]
allIndexList = players.TitleIndex.unique()
game_features = game_features.iloc[allIndexList]
game_features.reset_index(drop=True,inplace = True)

players['TitleIndex'] = players['Name'].apply(switchToIndex)
g = players.groupby('User_ID').TitleIndex
player_list = pd.concat([g.apply(list),g.count()],axis=1,keys=['games','count'])
player_list = player_list.drop(player_list[player_list['count']==1].index)
#player_list['games'] = player_list['games'].apply(toLowerCase)
player_list['games'] = player_list['games'].apply(sorted)
source = {}
game_features['neighborList'] = [{} for _ in range(len(game_features))]
game_list = players.TitleIndex.unique()

def getEdgeList():
    for index,row in player_list.iterrows():
        games = row['games']
        for i in range(len(games)-1):

            if games[i] not in source:
                source[games[i]] = []

            for j in range(i+1,len(games)):

                if games[j] not in source[games[i]]:
                    source[games[i]].append(games[j])
                    game_features.iloc[games[i]]['neighborList'][games[j]]=0
                    game_features.iloc[games[j]]['neighborList'][games[i]]=0

                game_features.iloc[games[i]]['neighborList'][games[j]]+=1
                game_features.iloc[games[j]]['neighborList'][games[i]]+=1
        if index%100==0:
            print(index)
    with open('network.txt','x') as the_file:
        the_file.write('{\n "nodes":[\n')
        for game in game_list:
            the_file.write('{"id": "'+str(game)+'"},\n')
        the_file.write('],\n "links":[\n')
        for key,value in source.items():
            for target in value:
                the_file.write('{"source": "' + str(key) + '", "target": "' + str(target) +'"},\n')
        the_file.write(']\n}')

getEdgeList()
game_features.to_csv('game-features.csv')