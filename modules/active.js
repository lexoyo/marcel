module.exports = {
  isModule: true,
  getStates: () => {
    return {
      en: [
        { "name": "marcel lets talk", "from": "passive", "to": "active" },
        { "name": "marcel shut up", "from": "active", "to": "passive" },
      ],
      fr: [
        { "name": "marcel parl", "from": "passive", "to": "active" },
        { "name": "marcel tais toi", "from": "active", "to": "passive" },
      ],
    };
  },
}
