const createPauseOverlay = (ctx, isMobile) => {
    return {
        ctx: ctx,
        render: function () {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, isMobile ? this.ctx.canvas.height / 2 : this.ctx.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Paused', this.ctx.canvas.width / 2, isMobile ? this.ctx.canvas.height / 2 / 2 : this.ctx.canvas.height / 2);
        }
    };
}

export default createPauseOverlay;