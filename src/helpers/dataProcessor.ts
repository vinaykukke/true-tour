const getSceneData = () => {
  const scenes = scene.children;
  const data = scenes.map((sc, i) => ({
    id: i + 1,
    meshId: sc.id,
    uuid: sc.uuid,
    hotspots: sc.children.map(getHotspotData),
    position: sc.position,
    fullPath: sc.userData.fullPath || "",
  }));

  return data;
};

const getHotspotData = (hs, i) => ({
  id: i + 1,
  meshId: hs.id,
  uuid: hs.uuid,
  userData: hs.userData,
  position: hs.position,
  sceneId: hs.userData.sceneId || "",
});

export default getSceneData;
