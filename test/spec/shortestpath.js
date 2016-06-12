describe('Shortest path: ', function(){
    it('should return [0, 4]', function(){
        addVertex({id: 0, nextStep:[1, 4], type:''});
        addVertex({id: 1, nextStep:[2], type:''});
        addVertex({id: 2, nextStep:[3], type:''});
        addVertex({id: 3, nextStep:[4], type:''});
        addVertex({id: 4, nextStep:[], type:'end', win: true});
        var s = shortestPath();
        expect(s.length).toBe(2);
        expect(s[0]).toBe(0);
        expect(s[1]).toBe(4);
    })
});
