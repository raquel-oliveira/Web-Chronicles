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
    });
    it('should return [0, 4, 7, 8, 10]', function(){
        addVertex({id: 0, nextStep:[1, 2, 3, 4], type:''});
        addVertex({id: 1, nextStep:[], type:'end', win: false});
        addVertex({id: 2, nextStep:[5], type:''});
        addVertex({id: 3, nextStep:[6], type:''});
        addVertex({id: 4, nextStep:[7], type:''});
        addVertex({id: 5, nextStep:[4], type:''});
        addVertex({id: 6, nextStep:[3], type:''});
        addVertex({id: 7, nextStep:[8], type:''});
        addVertex({id: 8, nextStep:[9, 10], type:''});
        addVertex({id: 9, nextStep:[10], type:''});
        addVertex({id: 10, nextStep:[], type:'end', win: true});

        var s = shortestPath();
        expect(s.length).toBe(5);
        expect(s[0]).toBe(0);
        expect(s[1]).toBe(4);
        expect(s[2]).toBe(7);
        expect(s[3]).toBe(8);
        expect(s[4]).toBe(10);
    });
});
