let _modPath;

exports.initialize = (modPath) =>{
    _modPath = modPath;

    Modding.setMenuItem({
        name: 'betterstats',
        tooltip: "Better Stats",
        tooltipPosition: 'top',
        faIcon: 'fa-line-chart',
        badgeCount: 0,
    });

    exports.views = [
        {
            name: 'betterstats',
            viewPath: _modPath + 'view.html',
            controller: function ($rootScope) {
                this.name = 'Jonas';
                this.betterStatsCSS = _modPath + 'betterstats.css';
                this.components = _.filter(Components, (component) => component.type === "Component");

                $rootScope.$on(GameEvents.InventoryChange, () => {
                    console.log('BetterStats: Refreshing Stats')
                    _.forEach(this.components, (component) => {
                        component.employeeAssigned = 0;
                        component.productionPerHour = 0;
                        component.unlockedComponent = false;
                        _.forEach($rootScope.settings.office.workstations, (workstation) => {
                            let workstationProductivity = CalculateWorkstationProductivity(workstation) / 100;

                            _.forEach(workstation.employee.components, (unlockedComponent) => {
                                if(unlockedComponent.name === component.name) {
                                    component.unlockedComponent = true;
                                }
                            });


                            if(workstation.employee.task && workstation.employee.task.component && workstation.employee.task.component.name === component.name && workstation.employee.task.state === "Running") {
                                component.employeeAssigned++;
                                component.productionPerHour += component.produceHours ? _.round(workstationProductivity / component.produceHours , 2) : 0;
                            }
                        })

                        component.productionPerDay = component.productionPerHour * 8;

                    })
                });
                $rootScope.$broadcast(GameEvents.InventoryChange);
                
            }
        }
    ]
};


exports.onLoadGame = settings => {};
exports.onNewHour = settings => {};
exports.onNewDay = settings => {};

